from bs4 import BeautifulSoup
import urllib2
import psycopg2

conn = psycopg2.connect(database="nfl_stats", user="postgres", password="pass123", host="127.0.0.1", port="5432")
print "Opened database successfully"

cur = conn.cursor()

team_map = {
    "WAS":"Redskins", "PHI":"Eagles", "NYG":"Giants", "DAL":"Cowboys", "MIN":"Vikings",
    "GNB":"Packers", "DET":"Lions", "CHI":"Bears", "CAR":"Panthers", "ATL":"Falcons",
    "NOR":"Saints", "TAM":"Buccaneers", "ARI":"Cardinals", "SEA":"Seahawks", "STL":"Rams",
    "SFO":"49ers", "NWE":"Patriots", "NYJ":"Jets", "BUF":"Bills", "MIA":"Dolphins",
    "CIN":"Bengals", "PIT":"Steelers", "BAL":"Ravens", "CLE":"Browns", "HOU":"Texans",
    "IND":"Colts", "JAX":"Jaguars", "TEN":"Titans", "DEN":"Broncos", "KAN":"Chiefs",
    "OAK":"Raiders", "SDG":"Chargers", "2TM":"Multiple", "3TM":"Multiple"
}

def make_soup(url):
    page = urllib2.urlopen(url)
    soupdata = BeautifulSoup(page, 'html.parser')
    return soupdata

def get_player_totals():
    soup = make_soup("http://www.pro-football-reference.com/years/2015/fantasy.htm")
    table_stats = soup.find("table", {"id":"fantasy"})

    data_array = []
    rank = 1
    player_data = {}

    body = table_stats.find('tbody')
    for record in body.findAll('tr'):
        for data in record.findAll('td'):
            data_array.append(data.text)
        if len(data_array) > 0:
            player_data[rank] = data_array
            data_array = []
            rank = rank + 1

    player_stats = {}

    for player in player_data:
        if len(player_data[player]) > 0:
            if len(player_data[player][2]) != 0:
                player_stats[player] = {
                        "name": player_data[player][0],
                        "team": player_data[player][1],
                        "position": player_data[player][2],
                        "age": player_data[player][3] if len(player_data[player][3]) > 0 else "0",
                        "games_played": player_data[player][4],
                        "games_started": player_data[player][5],
                        "completions": player_data[player][6],
                        "attempts": player_data[player][7],
                        "pass_yards": player_data[player][8],
                        "pass_tds": player_data[player][9],
                        "interceptions": player_data[player][10],
                        "carries": player_data[player][11],
                        "rush_yards": player_data[player][12],
                        "yards_per_carry": player_data[player][13],
                        "rush_tds": player_data[player][14],
                        "targets": player_data[player][15],
                        "receptions": player_data[player][16],
                        "rec_yards": player_data[player][17],
                        "yards_per_reception": player_data[player][18],
                        "rec_tds": player_data[player][19]
                }

    return player_stats

player_totals = get_player_totals()

# insert into players table
for player in player_totals:
    cur.execute("INSERT INTO PLAYERS (NAME, POSITION, AGE) \
          VALUES (%s, %s, %s);",
          (player_totals[player]["name"], player_totals[player]["position"], int(player_totals[player]["age"])))

# grab players.id, teams.id that match JSON object.
# load data into players_teams table
# load data into players_totals table
for player in player_totals:
    cur.execute("SELECT id from players where name=%(name)s and age=%(age)s;",
        {'name': player_totals[player]["name"], 'age': int(player_totals[player]["age"])})

    player_id = cur.fetchall()[0]

    cur.execute("SELECT id from teams where name=%(name)s;",
        {'name': team_map[player_totals[player]["team"]]})

    team_id = cur.fetchall()[0]

    cur.execute("INSERT INTO PLAYERS_TEAMS (PLAYER_ID, TEAM_ID, SEASON) \
        VALUES (%s, %s, %s);",
        (player_id, team_id, 2015))

    cur.execute("SELECT id from players_teams where player_id=%(player_id)s;",
        {'player_id': player_id})

    player_team_id = cur.fetchall()[0]

    cur.execute("INSERT INTO PLAYERS_TOTALS (PLAYERS_TEAM_ID, GAMES_PLAYED, GAMES_STARTED, COMPLETIONS, ATTEMPTS, PASS_TDS, INTERCEPTIONS, PASS_YARDS, CARRIES, RUSH_YARDS, RUSH_TDS, TARGETS, RECEPTIONS, REC_YARDS, REC_TDS) \
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);",
        (player_team_id, int(player_totals[player]["games_played"]), int(player_totals[player]["games_started"]), int(player_totals[player]["completions"]),
        int(player_totals[player]["attempts"]),int(player_totals[player]["pass_tds"]),int(player_totals[player]["interceptions"]),int(player_totals[player]["pass_yards"]),
        int(player_totals[player]["carries"]),int(player_totals[player]["rush_yards"]),int(player_totals[player]["rush_tds"]),
        int(player_totals[player]["targets"]),int(player_totals[player]["receptions"]),int(player_totals[player]["rec_yards"]),
        int(player_totals[player]["rec_tds"])))


conn.commit()
print "Records created successfully";
conn.close()
