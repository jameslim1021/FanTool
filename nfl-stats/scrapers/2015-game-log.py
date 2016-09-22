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

def get_game_log(team_url):
    soup = make_soup("http://www.pro-football-reference.com/teams/" + team_url + "/2015.htm")
    table_stats = soup.find("table", {"id":"games"})

    data_array = []
    week = 0
    week_data = {}

    for record in table_stats.findAll('tr'):
        for data in record.findAll('td'):
            data_array.append(data.text)
        if week < 18:
            week_data[week] = data_array
            data_array = []
            week = week + 1

    game_log = {}
    for game in week_data:
        if game > 0:
            if week_data[game][6] == "@":
                home = False
            else:
                home = True
            if week_data[game][7] == "Bye Week":
                game_log[game] = {
                    "opponent": "Bye Week",
                    "result": "Bye Week",
                    "record": "Bye Week",
                    "home": home,
                    "points_for": 0,
                    "points_against": 0,
                    "total_yards_for": 0,
                    "pass_yards_for": 0,
                    "rush_yards_for": 0,
                    "turnovers_lost": 0,
                    "total_yards_against": 0,
                    "pass_yards_against": 0,
                    "rush_yards_against": 0,
                    "turnovers_forced": 0
                }
            else:
                opponent_array = week_data[game][7].split(" ")
                opponent = opponent_array[len(opponent_array)-1]
                game_log[game] = {
                    "opponent": opponent,
                    "result": week_data[game][3],
                    "record": week_data[game][5],
                    "home": home,
                    "points_for": week_data[game][8],
                    "points_against": week_data[game][9],
                    "total_yards_for": week_data[game][11],
                    "pass_yards_for": week_data[game][12],
                    "rush_yards_for": week_data[game][13],
                    "turnovers_lost": week_data[game][14] if len(week_data[game][14]) > 0 else 0,
                    "total_yards_against": week_data[game][16],
                    "pass_yards_against": week_data[game][17],
                    "rush_yards_against": week_data[game][18],
                    "turnovers_forced": week_data[game][19] if len(week_data[game][19]) > 0 else 0
                }

    return game_log

# game_log_2015 = {
#     "Redskins":get_game_log("was"), "Eagles":get_game_log("phi"), "Giants":get_game_log("nyg"), "Cowboys":get_game_log("dal"),
#     "Vikings":get_game_log("min"), "Packers":get_game_log("gnb"), "Lions":get_game_log("det"), "Bears":get_game_log("chi"),
#     "Panthers":get_game_log("car"), "Falcons":get_game_log("atl"), "Saints":get_game_log("nor"), "Buccaneers":get_game_log("tam"),
#     "Cardinals":get_game_log("crd"), "Seahawks":get_game_log("sea"), "Rams":get_game_log("ram"), "49ers":get_game_log("sfo"),
#     "Patriots":get_game_log("nwe"), "Jets":get_game_log("nyj"), "Bills":get_game_log("buf"), "Dolphins":get_game_log("mia"),
#     "Bengals":get_game_log("cin"), "Steelers":get_game_log("pit"), "Ravens":get_game_log("rav"), "Browns":get_game_log("cle"),
#     "Texans":get_game_log("htx"), "Colts":get_game_log("clt"), "Jaguars":get_game_log("jax"), "Titans":get_game_log("oti"),
#     "Broncos":get_game_log("den"), "Chiefs":get_game_log("kan"), "Raiders":get_game_log("rai"), "Chargers":get_game_log("sdg")
# }

game_log_2015 = {"Redskins":get_game_log("was"), "Eagles":get_game_log("phi")}

for team in game_log_2015:
    for week in game_log_2015[team]:
        cur.execute("SELECT id from teams where name=%(name)s;",
            {'name': team})

        team_id = cur.fetchall()[0]
        print game_log_2015[team][week]["opponent"]
        cur.execute("SELECT id from teams where name=%(name)s;",
        {'name': game_log_2015[team][week]["opponent"]})

        opponent_id = cur.fetchall()[0]

        print team_id, opponent_id

        cur.execute("INSERT INTO GAMES (TEAM_ID, OPPONENT_ID, SEASON, WEEK, RESULT, RECORD, HOME, POINTS_FOR, POINTS_AGAINST, TOTAL_YARDS_FOR, PASS_YARDS_FOR, RUSH_YARDS_FOR, TURNOVERS_LOST, TOTAL_YARDS_AGAINST, PASS_YARDS_AGAINST, RUSH_YARDS_AGAINST, TURNOVERS_FORCED) \
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);",
            (team_id, opponent_id, 2015, week, game_log_2015[team][week]["result"],game_log_2015[team][week]["record"],game_log_2015[team][week]["home"],
            int(game_log_2015[team][week]["points_for"]), int(game_log_2015[team][week]["points_against"]),int(game_log_2015[team][week]["total_yards_for"]),int(game_log_2015[team][week]["pass_yards_for"]),
            int(game_log_2015[team][week]["rush_yards_for"]),int(game_log_2015[team][week]["turnovers_lost"]),int(game_log_2015[team][week]["total_yards_against"]),
            int(game_log_2015[team][week]["pass_yards_against"]), int(game_log_2015[team][week]["rush_yards_against"]), int(game_log_2015[team][week]["turnovers_forced"])))

conn.commit()
print "Records created successfully";
conn.close()
