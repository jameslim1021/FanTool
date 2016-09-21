from bs4 import BeautifulSoup
import urllib2

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
            player_stats[player] = {
                    "name": player_data[player][0],
                    "team": player_data[player][1],
                    "position": player_data[player][2],
                    "age": player_data[player][3],
                    "gamesPlayed": player_data[player][4],
                    "gamesStarted": player_data[player][5],
                    "passing" : {
                        "completions": player_data[player][6],
                        "attempts": player_data[player][7],
                        "yards": player_data[player][8],
                        "touchdowns": player_data[player][9],
                        "interceptions": player_data[player][10]
                    },
                    "rushing" : {
                        "carries": player_data[player][11],
                        "yards": player_data[player][12],
                        "ydsPerCarry": player_data[player][13],
                        "touchdowns": player_data[player][14]
                    },
                    "receiving" : {
                        "targets": player_data[player][15],
                        "receptions": player_data[player][16],
                        "yards": player_data[player][17],
                        "ydsPerReception": player_data[player][18],
                        "touchdowns": player_data[player][19]
                    },
            }

    return player_stats

print get_player_totals()
