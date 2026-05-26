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
                Authorization: \`Bearer \${token}\`,
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

            .sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            )

            .slice(0, 10);

    fs.writeFileSync(
        './src/assets/discussions.json',
        JSON.stringify(discussions, null, 2)
    );

    console.log('discussions.json generated');
}

generate();
