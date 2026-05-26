const token = process.env.GH_TOKEN;

async function getCategories() {

  const query = `
  {
    repository(owner: "Mryan2005", name: "MyHomePage") {

      discussionCategories(first: 20) {

        nodes {

          id
          name
          emoji

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

  console.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );
}

getCategories();
