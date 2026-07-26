const fs = require('fs');

const token = process.env.GH_TOKEN;

/**
 * 解析讨论正文中的任务复选框，返回进度统计。
 * 识别 "- [x]" (已完成) 和 "- [ ]" (未完成)。
 */
function parseProgress(body) {
    if (!body || typeof body !== 'string') {
        return { total: 0, completed: 0 };
    }

    const checked = (body.match(/^\s*- \[[xX]\]/gm) || []).length;
    const unchecked = (body.match(/^\s*- \[ \]/gm) || []).length;
    const total = checked + unchecked;

    return { total, completed: checked };
}

async function generate() {

    const query = `
{
  repository(owner: "Mryan2005", name: "MyHomePage") {

    discussions(
      first: 100,
      categoryId: "DIC_kwDOMuiJU84C94Ga"
    ) {

      nodes {

        title

        url

        createdAt

        closed

        body

        category {
          name
        }

        author {
          login
        }

        labels(first: 10) {
          nodes {
            name
          }
        }

      }

    }

  }

}
`;

    const response = await fetch(
        'https://api.github.com/graphql',
        {
            method: 'POST',

            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                query
            })
        }
    );

    const result = await response.json();

    if (result.errors) {
        console.error('GraphQL errors:', JSON.stringify(result.errors, null, 2));
        process.exit(1);
    }

    const discussions =
        result.data.repository.discussions.nodes

            .map(d => {
                const progress = parseProgress(d.body || '');
                return {
                    ...d,
                    labels: d.labels?.nodes || [],
                    progress
                };
            })

            .sort((a, b) => {

                // 排序优先级: Ongoing(0) → Pause(1) → Done(2)
                const order = d =>
                    d.labels?.length ? 1 :   // Pause
                    d.closed          ? 2 :   // Done
                                         0;    // Ongoing

                const diff = order(a) - order(b);
                if (diff !== 0) return diff;

                // 同组内按时间倒序
                return (
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
                );
            });

    // 分类统计
    const categories = {};
    for (const d of discussions) {
        const catName = d.category?.name || 'Uncategorized';
        if (!categories[catName]) {
            categories[catName] = { total: 0, ongoing: 0, pause: 0, done: 0 };
        }
        categories[catName].total++;
        if (d.labels?.length) categories[catName].pause++;
        else if (d.closed) categories[catName].done++;
        else categories[catName].ongoing++;
    }

    console.log('\n📂 各分类统计:');
    console.log('─'.repeat(56));
    for (const [name, stats] of Object.entries(categories)) {
        console.log(`  ${name}: 共${stats.total}个 (进行中${stats.ongoing}, 暂停${stats.pause}, 已完成${stats.done})`);
    }
    console.log('─'.repeat(56));

    // 输出总进度摘要
    const overallTotal = discussions.reduce((sum, d) => sum + (d.progress?.total || 0), 0);
    const overallCompleted = discussions.reduce((sum, d) => sum + (d.progress?.completed || 0), 0);
    console.log(`\n📊 总进度: ${overallCompleted}/${overallTotal} (${overallTotal > 0 ? Math.round(overallCompleted / overallTotal * 100) : 0}%)`);
    console.log(`📋 共 ${discussions.length} 条讨论`);

    fs.writeFileSync(
        './src/assets/discussions.json',
        JSON.stringify(discussions, null, 2)
    );

    console.log('discussions.json generated');
}

generate();
