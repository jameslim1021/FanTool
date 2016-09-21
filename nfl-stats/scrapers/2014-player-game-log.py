from bs4 import BeautifulSoup
import urllib2
import re

# different method for parsing comments. better than using the RegEx method in team-totals scraper scripts
comm = re.compile("<!--|-->")

team_map = {"Redskins":"was", "Eagles":"phi", "Giants":"nyg", "Cowboys":"dal",
    "Vikings":"min", "Packers":"gnb", "Lions":"det", "Bears":"chi",
    "Panthers":"car", "Falcons":"atl", "Saints":"nor", "Buccaneers":"tam",
    "Cardinals":"crd", "Seahawks":"sea", "Rams":"ram", "49ers":"sfo",
    "Patriots":"nwe", "Jets":"nyj", "Bills":"buf", "Dolphins":"mia",
    "Bengals":"cin", "Steelers":"pit", "Ravens":"rav", "Browns":"cle",
    "Texans":"htx", "Colts":"clt", "Jaguars":"jax", "Titans":"oti",
    "Broncos":"den", "Chiefs":"kan", "Raiders":"rai", "Chargers":"sdg"}

date_map = {"September": {"month": "09", "year": "2014"}, "October": {"month": "10", "year": "2014"},
    "November": {"month": "11", "year": "2014"}, "December": {"month": "12", "year": "2014"},
    "January": {"month": "01", "year": "2015"}}

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
        if len(date_arr[1]) == 1:
            date_arr[1] = "0" + date_arr[1]
        new_date = date_map[date_arr[0]]["year"] + date_map[date_arr[0]]["month"] + date_arr[1]
        return new_date


def make_soup(url):
    page = urllib2.urlopen(url)
    soupdata = BeautifulSoup(comm.sub("", page.read()), 'lxml')
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
            game_log[game] = {
                "date": week_data[game][1],
                "home": home,
                "opponent": team_abbrev(week_data[game][7])
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
game_log_2015 = {"was":get_game_log("was")}


url_info = {}

# format for url
for team in game_log_2015:
    url_info[team] = {}
    for game in game_log_2015[team]:
        url_info[team][game] = {}
        if len(game_log_2015[team][game]) > 0:
            url_info[team][game]["date"] = format_date(game_log_2015[team][game]["date"])
            if game_log_2015[team][game]["home"] == True:
                url_info[team][game]["city"] = team
            else:
                url_info[team][game]["city"] = game_log_2015[team][game]["opponent"]

def get_player_log(url_obj):
    player_log = {}

    for team in url_obj:
        player_log[team] = {}
        for week in url_obj[team]:
            if url_obj[team][week]["date"] == "Bye Week":
                player_log[team][week] = "Bye Week"
            else:
                player_log[team][week] = {}
                soup = make_soup("http://www.pro-football-reference.com/boxscores/" + url_obj[team][week]["date"] + "0" + url_obj[team][week]["city"] + ".htm")
                table_stats = soup.find('table', id='player_offense')

                table = table_stats.encode('utf-8')
                soupdata = BeautifulSoup(table, 'lxml')

                body = soupdata.find('tbody')

                # names of players on both teams
                names = []
                for record in body.findAll('tr'):
                    for data in record.findAll('th'):
                        if len(data.text.split(" ")) > 1:
                            names.append(data.text)

                # one player's stats
                player_data = []
                # collection of players' stats arrays. length of this array should equal length of names array
                player_data_array = []
                # loop and map names to stats
                for record in body.findAll('tr'):
                    for data in record.findAll('td'):
                        player_data.append(data.text)
                    if len(player_data) > 0:
                        player_data_array.append(player_data)
                        player_data = []

                # map names to stats
                for i in range(0,len(player_data_array)-1):
                    player_log[team][week][names[i]] = {
                        "team": player_data_array[i][0],
                        "completions": player_data_array[i][1],
                        "attempts": player_data_array[i][2],
                        "pass_yards": player_data_array[i][3],
                        "pass_tds": player_data_array[i][4],
                        "interceptions": player_data_array[i][5],
                        "num_sacks": player_data_array[i][6],
                        "sack_yards": player_data_array[i][7],
                        "pass_long": player_data_array[i][8],
                        "qbr": player_data_array[i][9] if len(player_data_array[i][9]) > 0 else '0',
                        "carries": player_data_array[i][10],
                        "rush_yards": player_data_array[i][11],
                        "rush_tds": player_data_array[i][12],
                        "rush_long": player_data_array[i][13],
                        "targets": player_data_array[i][14],
                        "receptions": player_data_array[i][15],
                        "rec_yards": player_data_array[i][16],
                        "rec_tds": player_data_array[i][17],
                        "rec_long": player_data_array[i][18],
                        "fumbles": player_data_array[i][19],
                        "fumbles_lost": player_data_array[i][20],
                    }

                player_data_array = []

    return player_log

print get_player_log(url_info)
