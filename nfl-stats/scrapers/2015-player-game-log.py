from bs4 import BeautifulSoup, Comment
import urllib2


team_map = {"Redskins":"was", "Eagles":"phi", "Giants":"nyg", "Cowboys":"dal",
    "Vikings":"min", "Packers":"gnb", "Lions":"det", "Bears":"chi",
    "Panthers":"car", "Falcons":"atl", "Saints":"nor", "Buccaneers":"tam",
    "Cardinals":"crd", "Seahawks":"sea", "Rams":"ram", "49ers":"sfo",
    "Patriots":"nwe", "Jets":"nyj", "Bills":"buf", "Dolphins":"mia",
    "Bengals":"cin", "Steelers":"pit", "Ravens":"rav", "Browns":"cle",
    "Texans":"htx", "Colts":"clt", "Jaguars":"jax", "Titans":"oti",
    "Broncos":"den", "Chiefs":"kan", "Raiders":"rai", "Chargers":"sdg"}

date_map = {"September": {"month": "09", "year": "2015"}, "October": {"month": "10", "year": "2015"},
    "November": {"month": "11", "year": "2015"}, "December": {"month": "12", "year": "2015"},
    "January": {"month": "01", "year": "2016"}}

def team_abbrev(team):
    team_arr = team.split(" ")
    if team_arr[0] == "Bye":
        return "Bye Week"
    else:
        return team_map[team_arr[len(team_arr)-1]]

def format_date(date):
    if len(date) == 0:
        return "Bye Week"
    else:
        date_arr = date.split(" ")
        new_date = date_map[date_arr[0]]["year"] + date_map[date_arr[0]]["month"] + date_arr[1]
        return new_date


def make_soup(url):
    page = urllib2.urlopen(url)
    soupdata = BeautifulSoup(page, 'lxml')
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
        if week < 18:
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
                "home": home,
                "opponent": team_abbrev(weekData[game][7])
            }
    return game_log

# game_log_2015 = {
#     "was":get_game_log("was"), "phi":get_game_log("phi"), "nyg":get_game_log("nyg"), "dal":get_game_log("dal"),
#     "min":get_game_log("min"), "gnb":get_game_log("gnb"), "det":get_game_log("det"), "chi":get_game_log("chi"),
#     "car":get_game_log("car"), "atl":get_game_log("atl"), "nor":get_game_log("nor"), "tam":get_game_log("tam"),
#     "crd":get_game_log("crd"), "sea":get_game_log("sea"), "ram":get_game_log("ram"), "sfo":get_game_log("sfo"),
#     "nwe":get_game_log("nwe"), "nyj":get_game_log("nyj"), "buf":get_game_log("buf"), "mia":get_game_log("mia"),
#     "cin":get_game_log("cin"), "pit":get_game_log("pit"), "rav":get_game_log("rav"), "cle":get_game_log("cle"),
#     "htx":get_game_log("htx"), "clt":get_game_log("clt"), "jax":get_game_log("jax"), "oti":get_game_log("oti"),
#     "den":get_game_log("den"), "kan":get_game_log("kan"), "rai":get_game_log("rai"), "sdg":get_game_log("sdg")
# }

testt = {"was":get_game_log("was")}

url_info = {}

for team in testt:
    for game in testt[team]:
        url_info[game] = {}
        if len(testt[team][game]) > 0:
            url_info[game]["date"] = format_date(testt[team][game]["date"])
            if testt[team][game]["home"] == True:
                url_info[game]["team"] = team
            else:
                url_info[game]["team"] = testt[team][game]["opponent"]

def get_player_log(url_obj):
    # for week in url_obj:
    # soup = make_soup("http://www.pro-football-reference.com/boxscores/" + url_obj[1]["date"] + "0" + url_obj[1]["team"] + ".htm")
    soup = make_soup("http://www.pro-football-reference.com/boxscores/201509130was.htm")
    player_div = soup.find_all('table', id_='team_stats')
    print player_div
    # offense_table = player_div.find('table', {"id":"player_offense"})
    # print player_div
    # body = tableStats.find('tbody')
    # for record in body.findAll('tr'):
    #     for data in record.findAll('td'):
    #         print data.text

print get_player_log(url_info)
