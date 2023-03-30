from unittest import TestCase

import build


class Test(TestCase):
    def test_split_games_1(self):
        s = 'Mario, Zelda, Hey You, Pikachu!, Poing'
        fixed = build.split_games(s)
        self.assertEqual(["Hey You, Pikachu!", "Mario", "Zelda", "Poing"], fixed)

    def test_split_games_2(self):
        s = 'Hey You, Pikachu!'
        fixed = build.split_games(s)
        self.assertEqual(["Hey You, Pikachu!"], fixed)

    def test_split_games_3(self):
        s = 'Mario, Zelda'
        fixed = build.split_games(s)
        self.assertEqual(["Mario", "Zelda"], fixed)

    def test_split_games_4(self):
        s = 'Mario, Zelda, Hey You, Pikachu!'
        fixed = build.split_games(s)
        self.assertEqual(["Hey You, Pikachu!", "Mario", "Zelda"], fixed)

    def test_split_games_5(self):
        s = 'Hey You, Pikachu!, Mario, Zelda, Poing'
        fixed = build.split_games(s)
        self.assertEqual(["Hey You, Pikachu!", "Mario", "Zelda", "Poing"], fixed)