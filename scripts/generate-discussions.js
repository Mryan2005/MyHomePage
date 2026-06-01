const fs = require('fs');

const token = process.env.GH_TOKEN;

async function generate() {

    const query = `
{
  repository(owner: "Mryan2005", name: "MyHomePage") {

    discussions(
      first: 30,
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

    console.log(result);

    const discussions =
        result.data.repository.discussions.nodes

            .map(d => ({
                ...d,
                labels: d.labels?.nodes || []
            }))

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
            })

            .slice(0, 10);

    fs.writeFileSync(
        './src/assets/discussions.json',
        JSON.stringify(discussions, null, 2)
    );

    console.log('discussions.json generated');
}

generate();
