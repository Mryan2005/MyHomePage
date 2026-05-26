const fs = require('fs');

const token = process.env.GH_TOKEN;

async function generate() {

  const response = await fetch(
    'https://api.github.com/repos/Mryan2005/MyHomePage/issues?labels=status',
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json'
      }
    }
  );

  const data = await response.json();

  // 🚨 打印真实返回
  console.log(data);

  // 🚨 防止不是数组
  if (!Array.isArray(data)) {

    throw new Error(
      `GitHub API Error: ${JSON.stringify(data, null, 2)}`
    );
  }

  const issues = data
    .filter(issue => !issue.pull_request)
    .slice(0, 10)
    .map(issue => ({

      title: issue.title,

      url: issue.html_url,

      created_at: issue.created_at,

      labels: issue.labels.map(l => ({
        name: l.name,
        color: l.color
      }))

    }));

  fs.writeFileSync(
    './src/assets/issues.json',
    JSON.stringify(issues, null, 2)
  );

  console.log('issues.json generated');
}

generate();
