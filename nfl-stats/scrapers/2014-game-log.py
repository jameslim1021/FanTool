from bs4 import BeautifulSoup
import urllib2

def make_soup(url):
    page = urllib2.urlopen(url)
    soupdata = BeautifulSoup(page, 'html.parser')
    return soupdata

def get_game_log(team_url):
    soup = make_soup("http://www.pro-football-reference.com/teams/" + team_url + "/2014.htm")
    tableStats = soup.find("table", {"id":"games"})
    
    dataArray = []
    week = 0
    weekData = {}

    for record in tableStats.findAll('tr'):
        for data in record.findAll('td'):
            dataArray.append(data.text)
        weekData[week] = dataArray
        dataArray = []
        week = week + 1

    game_log = {}

    for game in weekData:
        if game > 0:
            if weekData[game][6] == "@":
                home = False
            else:
                home = True
            game_log[game] = {
                "Date": weekData[game][1],
                "Result": weekData[game][3],
                "Record": weekData[game][5],
                "Home": home,
                "Opponent": weekData[game][7],
                "PointsFor": weekData[game][8],
                "PointsAgainst": weekData[game][9],
                "TotalYardsFor": weekData[game][11],
                "PassYardsFor": weekData[game][12],
                "RushYardsFor": weekData[game][13],
                "Turnovers Lost": weekData[game][14],
                "TotalYardsAgainst": weekData[game][16],
                "PassYardsAgainst": weekData[game][17],
                "RushYardsAgainst": weekData[game][18],
                "Turnovers Forced": weekData[game][19]
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
