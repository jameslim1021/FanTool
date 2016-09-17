from bs4 import BeautifulSoup
import urllib2

def make_soup(url):
    page = urllib2.urlopen(url)
    soupdata = BeautifulSoup(page, 'html.parser')
    return soupdata

def get_player_totals():
    soup = make_soup("http://www.pro-football-reference.com/years/2015/fantasy.htm")
    tableStats = soup.find("table", {"id":"fantasy"})

    dataArray = []
    rank = 1
    playerData = {}

    body = tableStats.find('tbody')
    for record in body.findAll('tr'):
        for data in record.findAll('td'):
            dataArray.append(data.text)
        if len(dataArray) > 0:
            playerData[rank] = dataArray
            dataArray = []
            rank = rank + 1

    playerStats = {}

    for player in playerData:
        if len(playerData[player]) > 0:
            playerStats[player] = {
                    "name": playerData[player][0],
                    "team": playerData[player][1],
                    "position": playerData[player][2],
                    "age": playerData[player][3],
                    "gamesPlayed": playerData[player][4],
                    "gamesStarted": playerData[player][5],
                    "passing" : {
                        "completions": playerData[player][6],
                        "attempts": playerData[player][7],
                        "yards": playerData[player][8],
                        "touchdowns": playerData[player][9],
                        "interceptions": playerData[player][10]
                    },
                    "rushing" : {
                        "carries": playerData[player][11],
                        "yards": playerData[player][12],
                        "ydsPerCarry": playerData[player][13],
                        "touchdowns": playerData[player][14]
                    },
                    "receiving" : {
                        "targets": playerData[player][15],
                        "receptions": playerData[player][16],
                        "yards": playerData[player][17],
                        "ydsPerReception": playerData[player][18],
                        "touchdowns": playerData[player][19]
                    },
            }

    return playerStats

print get_player_totals()
