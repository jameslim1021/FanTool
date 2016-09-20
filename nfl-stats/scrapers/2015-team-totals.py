from bs4 import BeautifulSoup, Comment
import requests, re

def make_soup(url):
    r = requests.get(url)
    soupdata = BeautifulSoup(r.text, 'lxml')
    return soupdata

def get_team_totals():
    soup = make_soup("http://www.pro-football-reference.com/years/2015/")

    # get the comments
    comments = soup.findAll(text=lambda text:isinstance(text, Comment))

    # look for table with the id "team_stats"
    rx = re.compile(r'<table.+?id="team_stats".+?>[\s\S]+?</table>')
    for comment in comments:
        try:
            tableStats = rx.search(comment.string).group(0)
            # break the loop if found
            break
        except:
            pass

    table = tableStats.encode('utf-8')
    soupdata = BeautifulSoup(table, 'lxml')
    dataArray = []
    team = 1
    teamData = {}

    for record in soupdata.findAll('tr'):
        for data in record.findAll('td'):
            dataArray.append(data.text)
        if len(dataArray) > 0:
            teamData[team] = dataArray
            dataArray = []
            team = team + 1

    teamStats = {}

    for team in teamData:
        if len(teamData[team]) > 0:
            teamStats[team] = {
                "name": teamData[team][0],
                "points": teamData[team][2],
                "totalYards": teamData[team][3],
                "turnovers": teamData[team][6],
                "completions": teamData[team][9],
                "attempts": teamData[team][10],
                "passYards": teamData[team][11],
                "passTds": teamData[team][12],
                "interceptions": teamData[team][13],
                "carries": teamData[team][16],
                "rushYards": teamData[team][17],
                "rushTds": teamData[team][18]
            }

    return teamStats

print get_team_totals()
