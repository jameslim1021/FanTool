from bs4 import BeautifulSoup
import urllib2
import re

import psycopg2

conn = psycopg2.connect(database="nfl_stats", user="postgres", password="pass123", host="127.0.0.1", port="5432")
print "Opened database successfully"

cur = conn.cursor()

# different method for parsing comments. better than using the RegEx method in team-totals scraper scripts
comm = re.compile("<!--|-->")

url_team_map = {"Redskins":"was", "Eagles":"phi", "Giants":"nyg", "Cowboys":"dal",
    "Vikings":"min", "Packers":"gnb", "Lions":"det", "Bears":"chi",
    "Panthers":"car", "Falcons":"atl", "Saints":"nor", "Buccaneers":"tam",
    "Cardinals":"crd", "Seahawks":"sea", "Rams":"ram", "49ers":"sfo",
    "Patriots":"nwe", "Jets":"nyj", "Bills":"buf", "Dolphins":"mia",
    "Bengals":"cin", "Steelers":"pit", "Ravens":"rav", "Browns":"cle",
    "Texans":"htx", "Colts":"clt", "Jaguars":"jax", "Titans":"oti",
    "Broncos":"den", "Chiefs":"kan", "Raiders":"rai", "Chargers":"sdg"}

team_map = {
    "WAS":"Redskins", "PHI":"Eagles", "NYG":"Giants", "DAL":"Cowboys", "MIN":"Vikings",
    "GNB":"Packers", "DET":"Lions", "CHI":"Bears", "CAR":"Panthers", "ATL":"Falcons",
    "NOR":"Saints", "TAM":"Buccaneers", "ARI":"Cardinals", "SEA":"Seahawks", "LAR":"Rams",
    "SFO":"49ers", "NWE":"Patriots", "NYJ":"Jets", "BUF":"Bills", "MIA":"Dolphins",
    "CIN":"Bengals", "PIT":"Steelers", "BAL":"Ravens", "CLE":"Browns", "HOU":"Texans",
    "IND":"Colts", "JAX":"Jaguars", "TEN":"Titans", "DEN":"Broncos", "KAN":"Chiefs",
    "OAK":"Raiders", "SDG":"Chargers", "2TM":"Multiple", "3TM":"Multiple", "4TM":"Multiple"
}

date_map = {"September": {"month": "09", "year": "2016"}, "October": {"month": "10", "year": "2016"},
    "November": {"month": "11", "year": "2016"}, "December": {"month": "12", "year": "2016"},
    "January": {"month": "01", "year": "2017"}}

def team_abbrev(team):
    team_arr = team.split(" ")
    if team_arr[0] == "Bye":
        return "Bye Week"
    else:
        return url_team_map[team_arr[len(team_arr)-1]]

def format_date(date):
    if len(date) == 0:
        return "Bye Week"
    else:
        date_arr = date.split(" ")
        if len(date_arr[1]) == 1:
            date_arr[1] = "0" + date_arr[1]
        new_date = date_map[date_arr[0]]["year"] + date_map[date_arr[0]]["month"] + date_arr[1]
        return new_date


def make_soup(url):
    page = urllib2.urlopen(url)
    soupdata = BeautifulSoup(comm.sub("", page.read()), 'lxml')
    return soupdata

def get_game_log(team_url):
    soup = make_soup("http://www.pro-football-reference.com/teams/" + team_url + "/2016.htm")
    table_stats = soup.find("table", {"id":"games"})

    data_array = []
    week = 0
    week_data = {}

    for record in table_stats.findAll('tr'):
        for data in record.findAll('td'):
            data_array.append(data.text)
        if week < 19:
            week_data[week] = data_array
            data_array = []
            week = week + 1

    game_log = {}

    for game in week_data:
        if game > 1:
            if week_data[game][2] != 'preview':
                if week_data[game][6] == "@":
                    home = False
                else:
                    home = True
                game_log[game] = {
                    "date": week_data[game][1],
                    "home": home,
                    "opponent": team_abbrev(week_data[game][7])
                }
    return game_log

game_log_2016 = {
    "Redskins":get_game_log("was"), "Eagles":get_game_log("phi"), "Giants":get_game_log("nyg"), "Cowboys":get_game_log("dal"),
    "Vikings":get_game_log("min"), "Packers":get_game_log("gnb"), "Lions":get_game_log("det"), "Bears":get_game_log("chi"),
    "Panthers":get_game_log("car"), "Falcons":get_game_log("atl"), "Saints":get_game_log("nor"), "Buccaneers":get_game_log("tam"),
    "Cardinals":get_game_log("crd"), "Seahawks":get_game_log("sea"), "Rams":get_game_log("ram"), "49ers":get_game_log("sfo"),
    "Patriots":get_game_log("nwe"), "Jets":get_game_log("nyj"), "Bills":get_game_log("buf"), "Dolphins":get_game_log("mia"),
    "Bengals":get_game_log("cin"), "Steelers":get_game_log("pit"), "Ravens":get_game_log("rav"), "Browns":get_game_log("cle"),
    "Texans":get_game_log("htx"), "Colts":get_game_log("clt"), "Jaguars":get_game_log("jax"), "Titans":get_game_log("oti"),
    "Broncos":get_game_log("den"), "Chiefs":get_game_log("kan"), "Raiders":get_game_log("rai"), "Chargers":get_game_log("sdg")
}

url_info = {}

# format for url
for team in game_log_2016:
    url_info[team] = {}
    for game in game_log_2016[team]:
        url_info[team][game] = {}
        if len(game_log_2016[team][game]) > 0:
            url_info[team][game]["date"] = format_date(game_log_2016[team][game]["date"])
            if game_log_2016[team][game]["home"] == True:
                url_info[team][game]["city"] = url_team_map[team]
            else:
                url_info[team][game]["city"] = game_log_2016[team][game]["opponent"]

def get_player_log(url_obj):
    player_log = {}

    for team in url_obj:
        player_log[team] = {}
        for week in url_obj[team]:
            if url_obj[team][week]["date"] == "Bye Week":
                player_log[team][week]= {}
                player_log[team][week]["Bye Week"]= {
                    "team": team,
                    "completions": 0,
                    "attempts": 0,
                    "pass_yards": 0,
                    "pass_tds": 0,
                    "interceptions": 0,
                    "times_sacked": 0,
                    "sack_yards": 0,
                    "pass_long": 0,
                    "carries": 0,
                    "rush_yards": 0,
                    "rush_tds": 0,
                    "rush_long": 0,
                    "targets": 0,
                    "receptions": 0,
                    "rec_yards": 0,
                    "rec_tds": 0,
                    "rec_long": 0,
                    "fumbles": 0,
                    "fumbles_lost": 0,
                }
            else:
                player_log[team][week] = {}
                soup = make_soup("http://www.pro-football-reference.com/boxscores/" + url_obj[team][week]["date"] + "0" + url_obj[team][week]["city"] + ".htm")
                table_stats = soup.find('table', id='player_offense')

                table = table_stats.encode('utf-8')
                soupdata = BeautifulSoup(table, 'lxml')

                body = soupdata.find('tbody')

                # names of players on both teams
                names = []
                for record in body.findAll('tr'):
                    for data in record.findAll('th'):
                        if len(data.text.split(" ")) > 1:
                            names.append(data.text)

                # one player's stats
                player_data = []
                # collection of players' stats arrays. length of this array should equal length of names array
                player_data_array = []
                # loop and map names to stats
                for record in body.findAll('tr'):
                    for data in record.findAll('td'):
                        player_data.append(data.text)
                    if len(player_data) > 0:
                        player_data_array.append(player_data)
                        player_data = []

                # map names to stats
                for i in range(0,len(player_data_array)-1):
                    player_log[team][week][names[i]] = {
                        "team": team_map[player_data_array[i][0]],
                        "completions": player_data_array[i][1],
                        "attempts": player_data_array[i][2],
                        "pass_yards": player_data_array[i][3],
                        "pass_tds": player_data_array[i][4],
                        "interceptions": player_data_array[i][5],
                        "times_sacked": player_data_array[i][6],
                        "pass_long": player_data_array[i][8],
                        "carries": player_data_array[i][10],
                        "rush_yards": player_data_array[i][11],
                        "rush_tds": player_data_array[i][12],
                        "rush_long": player_data_array[i][13],
                        "targets": player_data_array[i][14],
                        "receptions": player_data_array[i][15],
                        "rec_yards": player_data_array[i][16],
                        "rec_tds": player_data_array[i][17],
                        "rec_long": player_data_array[i][18],
                        "fumbles": player_data_array[i][19],
                        "fumbles_lost": player_data_array[i][20],
                    }

                player_data_array = []

    return player_log

player_log = get_player_log(url_info)
#
for team in player_log:
    for week in player_log[team]:
        for player in player_log[team][week]:
            if team == 'Rams':
                cur.execute("SELECT id from teams where name=%(name)s and city=%(city)s;",
                    {'name': team, 'city':'Los Angeles'})

                team_id = cur.fetchall()[0]
            else:
                cur.execute("SELECT id from teams where name=%(name)s;",
                    {'name': team})

                team_id = cur.fetchall()[0]

            cur.execute("SELECT id from players where name=%(name)s;",
            {'name': player})


            player_result = cur.fetchall()

            if len(player_result) == 0:
                continue
            else:
                player_id = player_result[0]

                cur.execute("SELECT id from players_teams where player_id=%(player_id)s and team_id=%(team_id)s and season=%(season)s;",
                    {'player_id':player_id, 'team_id':team_id, 'season': 2016})

                players_teams_result = cur.fetchall()

                # create record for players with multiple teams
                # i.e. players with two teams will have three records, 'Multiple Teams', 'Dallas Cowboys', 'Buffalo Bills'
                if len(players_teams_result) == 0:
                    cur.execute("INSERT INTO PLAYERS_TEAMS (PLAYER_ID, TEAM_ID, SEASON) \
                        VALUES (%s, %s, %s) RETURNING id;",
                        (player_id, team_id, 2016))

                    players_team_id = cur.fetchone()[0]
                else:
                    players_team_id = players_teams_result[0]

                    cur.execute("SELECT id from games where team_id=%(team_id)s and week=%(week)s and season=%(season)s;",
                        {'team_id':team_id, 'week':week, 'season': 2016})

                    game_id = cur.fetchall()[0]

                    cur.execute("INSERT INTO PLAYERS_GAMES (PLAYERS_TEAM_ID, GAME_ID, COMPLETIONS, ATTEMPTS, PASS_TDS, INTERCEPTIONS, PASS_YARDS, TIMES_SACKED, PASS_LONG, CARRIES, RUSH_YARDS, RUSH_TDS, RUSH_LONG, TARGETS, RECEPTIONS, REC_YARDS, REC_TDS, REC_LONG, FUMBLES, FUMBLES_LOST) \
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);",
                        (players_team_id, game_id, int(player_log[team][week][player]["completions"]),
                        int(player_log[team][week][player]["attempts"]),int(player_log[team][week][player]["pass_tds"]),int(player_log[team][week][player]["interceptions"]),
                        int(player_log[team][week][player]["pass_yards"]),int(player_log[team][week][player]["times_sacked"]),int(player_log[team][week][player]["pass_long"]),
                        int(player_log[team][week][player]["carries"]),int(player_log[team][week][player]["rush_yards"]),int(player_log[team][week][player]["rush_tds"]),
                        int(player_log[team][week][player]["rush_long"]),int(player_log[team][week][player]["targets"]),int(player_log[team][week][player]["receptions"]),
                        int(player_log[team][week][player]["rec_yards"]),int(player_log[team][week][player]["rec_tds"]),int(player_log[team][week][player]["rec_long"]),
                        int(player_log[team][week][player]["fumbles"]),int(player_log[team][week][player]["fumbles_lost"])))
#
conn.commit()
print "Records created successfully";
conn.close()
