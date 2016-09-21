from bs4 import BeautifulSoup
import urllib2

def make_soup(url):
    page = urllib2.urlopen(url)
    soupdata = BeautifulSoup(page, 'html.parser')
    return soupdata

def get_game_log(team_url):
    soup = make_soup("http://www.pro-football-reference.com/teams/" + team_url + "/2014.htm")
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

game_log_2014 = {
    "NFCeast" : {"was":get_game_log("was"), "phi":get_game_log("phi"), "nyg":get_game_log("nyg"), "dal":get_game_log("dal")},
    "NFCnorth" : {"min":get_game_log("min"), "gnb":get_game_log("gnb"), "det":get_game_log("det"), "chi":get_game_log("chi")},
    "NFCsouth" : {"car":get_game_log("car"), "atl":get_game_log("atl"), "nor":get_game_log("nor"), "tam":get_game_log("tam")},
    "NFCwest" : {"crd":get_game_log("crd"), "sea":get_game_log("sea"), "ram":get_game_log("ram"), "sfo":get_game_log("sfo")},
    "AFCeast" : {"nwe":get_game_log("nwe"), "nyj":get_game_log("nyj"), "buf":get_game_log("buf"), "mia":get_game_log("mia")},
    "AFCnorth" : {"cin":get_game_log("cin"), "pit":get_game_log("pit"), "rav":get_game_log("rav"), "cle":get_game_log("cle")},
    "AFCsouth" : {"htx":get_game_log("htx"), "clt":get_game_log("clt"), "jax":get_game_log("jax"), "oti":get_game_log("oti")},
    "AFCwest" : {"den":get_game_log("den"), "kan":get_game_log("kan"), "rai":get_game_log("rai"), "sdg":get_game_log("sdg")}
}


print game_log_2014
