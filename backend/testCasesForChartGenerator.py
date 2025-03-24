import unittest
import os
import chart_generator

class TestGenerateSpiderChart(unittest.TestCase):

    def setUp(self):
        self.categories = ['Speed', 'Strength', 'Agility', 'Stamina', 'Intellect']
        self.scores = [8, 6, 7, 9, 5]

    def test_chart_creation(self):
        chart_path = generate_spider_chart(self.categories, self.scores.copy())
        self.assertTrue(os.path.exists(chart_path))
        os.remove(chart_path)

    def test_empty_categories(self):
        with self.assertRaises(ValueError):
            generate_spider_chart([], [])

    def test_mismatched_lengths(self):
        with self.assertRaises(ValueError):
            generate_spider_chart(['Speed', 'Agility'], [8])

    def test_single_category(self):
        chart_path = generate_spider_chart(['Strength'], [10])
        self.assertTrue(os.path.exists(chart_path))
        os.remove(chart_path)

    def test_invalid_scores(self):
        with self.assertRaises(TypeError):
            generate_spider_chart(self.categories, ['a', 'b', 'c', 'd', 'e'])

if __name__ == '__main__':
    unittest.main()
