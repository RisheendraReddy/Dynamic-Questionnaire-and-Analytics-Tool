import matplotlib.pyplot as plt
import numpy as np

def generate_spider_chart(categories, scores):
    num_vars = len(categories)
    angles = np.linspace(0, 2 * np.pi, num_vars, endpoint=False).tolist()
    scores += scores[:1]
    angles += angles[:1]

    fig, ax = plt.subplots(figsize=(6, 6), subplot_kw=dict(polar=True))
    ax.fill(angles, scores, color='blue', alpha=0.25)
    ax.plot(angles, scores, color='blue', linewidth=2)
    ax.set_yticklabels([])
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(categories)

    chart_path = 'app/static/spider_chart.png'
    plt.savefig(chart_path, dpi=300)
    plt.close(fig)
    return chart_path
