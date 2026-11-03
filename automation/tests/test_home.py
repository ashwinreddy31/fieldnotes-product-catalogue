from pages.home_page import HomePage

def test_home_page(page):

    home = HomePage(page)

    home.open("https://www.google.com")

    assert "Google" in home.get_title()
    assert "Google" in home.get_title()