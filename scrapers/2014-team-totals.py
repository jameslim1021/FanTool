from bs4 import BeautifulSoup, Comment
import requests, re
import os
import psycopg2

# conn = psycopg2.connect(database="nfl_stats", user="postgres", password="pass123", host="127.0.0.1", port="5432")
conn = psycopg2.connect(os.environ.get('DATABASE_URL'))
print "Opened database successfully"

cur = conn.cursor()

def make_soup(url):
    r = requests.get(url)
    soupdata = BeautifulSoup(r.text, 'lxml')
    return soupdata

def get_team_totals():
    soup = make_soup("http://www.pro-football-reference.com/years/2014/")

    # get the comments
    comments = soup.findAll(text=lambda text:isinstance(text, Comment))

    # look for table with the id "team_stats"
    rx = re.compile(r'<table.+?id="team_stats".+?>[\s\S]+?</table>')
    for comment in comments:
        try:
            table_stats = rx.search(comment.string).group(0)
            # break the loop if found
            break
        except:
            pass

    table = table_stats.encode('utf-8')
    soupdata = BeautifulSoup(table, 'lxml')
    data_array = []
    team = 1
    team_data = {}

    for record in soupdata.findAll('tr'):
        for data in record.findAll('td'):
            data_array.append(data.text)
        if len(data_array) > 0 and team < 33:
            team_data[team] = data_array
            data_array = []
            team = team + 1

    team_stats = {}

    for team in team_data:
        if len(team_data[team]) > 0:
            team_name_array = team_data[team][0].split(' ')
            if len(team_name_array) == 3:
                city = team_name_array[0] + " " + team_name_array[1]
                team_name = team_name_array[2]
            else:
                city = team_name_array[0]
                team_name = team_name_array[1]
            team_stats[team] = {
                "city": city,
                "name": team_name,
                "points": team_data[team][2],
                "total_yards": team_data[team][3],
                "turnovers": team_data[team][6],
                "completions": team_data[team][9],
                "attempts": team_data[team][10],
                "pass_yards": team_data[team][11],
                "pass_tds": team_data[team][12],
                "interceptions": team_data[team][13],
                "carries": team_data[team][16],
                "rush_yards": team_data[team][17],
                "rush_tds": team_data[team][18]
            }

    return team_stats

team_totals = get_team_totals()

# uncomment to insert city and names into teams table
for team in team_totals:

    cur.execute("SELECT id from teams where name=%(name)s;",
                {'name': team_totals[team]["name"]})
    team_result = cur.fetchall()
    if len(team_result) == 0:
        cur.execute("INSERT INTO TEAMS (CITY, NAME) \
        VALUES (%s, %s);",
        (team_totals[team]["city"], team_totals[team]["name"]))
    else:
        team_id = team_result[0]
        cur.execute("INSERT INTO TEAMS_TOTALS (TEAM_ID, SEASON, POINTS, TOTAL_YARDS, TURNOVERS, COMPLETIONS, ATTEMPTS, PASS_YARDS, PASS_TDS, INTERCEPTIONS, CARRIES, RUSH_YARDS, RUSH_TDS) \
              VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);",
              (team_id, 2014, int(team_totals[team]["points"]),int(team_totals[team]["total_yards"]),int(team_totals[team]["turnovers"]),int(team_totals[team]["completions"]),int(team_totals[team]["attempts"]),int(team_totals[team]["pass_yards"]),
              int(team_totals[team]["pass_tds"]),int(team_totals[team]["interceptions"]),int(team_totals[team]["carries"]),int(team_totals[team]["rush_yards"]),int(team_totals[team]["rush_tds"])))

# added "multiple teams" row for players with more than one team in a season. scraped data has it as 2TM, 3TM, etc.
# cur.execute("INSERT INTO TEAMS (CITY, NAME) \
#       VALUES (%s, %s);",
#       ('Teams', 'Multiple'))
# cur.execute("INSERT INTO TEAMS (CITY, NAME) \
#       VALUES (%s, %s);",
#       ('Bye Week', 'Bye Week'))

# insert team stat totals into teams_totals

conn.commit()
print "Records created successfully";
conn.close()
