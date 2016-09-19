from bs4 import BeautifulSoup
import urllib2

def make_soup(url):
    page = urllib2.urlopen(url)
    soupdata = BeautifulSoup(page, 'html.parser')
    return soupdata

def get_game_log(team_url):
    soup = make_soup("http://www.pro-football-reference.com/teams/" + team_url + "/2015.htm")
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
                "date": weekData[game][1],
                "result": weekData[game][3],
                "record": weekData[game][5],
                "home": home,
                "opponent": weekData[game][7],
                "pointsFor": weekData[game][8],
                "pointsAgainst": weekData[game][9],
                "totalYardsFor": weekData[game][11],
                "passYardsFor": weekData[game][12],
                "rushYardsFor": weekData[game][13],
                "turnovers Lost": weekData[game][14],
                "totalYardsAgainst": weekData[game][16],
                "passYardsAgainst": weekData[game][17],
                "rushYardsAgainst": weekData[game][18],
                "turnovers Forced": weekData[game][19]
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

# hello
print game_log_2015
