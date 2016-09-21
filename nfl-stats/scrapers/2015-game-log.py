from bs4 import BeautifulSoup
import urllib2

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
            game_log[game] = {
                "date": week_data[game][1],
                "result": week_data[game][3],
                "record": week_data[game][5],
                "home": home,
                "opponent": week_data[game][7],
                "points_for": week_data[game][8],
                "points_against": week_data[game][9],
                "total_yards_for": week_data[game][11],
                "pass_yards_for": week_data[game][12],
                "rush_yards_for": week_data[game][13],
                "turnovers_lost": week_data[game][14],
                "total_yards_against": week_data[game][16],
                "pass_yards_against": week_data[game][17],
                "rush_yards_against": week_data[game][18],
                "turnovers_forced": week_data[game][19]
            }
    return game_log

game_log_2015 = {
    "NFCeast": {"Redskins":get_game_log("was"), "Eagles":get_game_log("phi"), "Giants":get_game_log("nyg"), "Cowboys":get_game_log("dal")},
    "NFCnorth": {"Vikings":get_game_log("min"), "Packers":get_game_log("gnb"), "Lions":get_game_log("det"), "Bears":get_game_log("chi")},
    "NFCsouth": {"Panthers":get_game_log("car"), "Falcons":get_game_log("atl"), "Saints":get_game_log("nor"), "Buccaneers":get_game_log("tam")},
    "NFCwest": {"Cardinals":get_game_log("crd"), "Seahawks":get_game_log("sea"), "Rams":get_game_log("ram"), "49ers":get_game_log("sfo")},
    "AFCeast": {"Patriots":get_game_log("nwe"), "Jets":get_game_log("nyj"), "Bills":get_game_log("buf"), "Dolphins":get_game_log("mia")},
    "AFCnorth": {"Bengals":get_game_log("cin"), "Steelers":get_game_log("pit"), "Ravens":get_game_log("rav"), "Browns":get_game_log("cle")},
    "AFCsouth": {"Texans":get_game_log("htx"), "Colts":get_game_log("clt"), "Jaguars":get_game_log("jax"), "Titans":get_game_log("oti")},
    "AFCwest": {"Broncos":get_game_log("den"), "Chiefs":get_game_log("kan"), "Raiders":get_game_log("rai"), "Chargers":get_game_log("sdg")}
}

print game_log_2015
