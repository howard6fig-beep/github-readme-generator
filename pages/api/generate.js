export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required.' });
  }

  try {
    // Fetch basic user data from public GitHub API
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'User-Agent': 'README-Generator-App'
      }
    });

    if (response.status === 404) {
      return res.status(404).json({ error: 'GitHub user not found.' });
    }

    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to fetch GitHub data.' });
    }

    const data = await response.json();

    // Generate Free Template
    const freeTemplate = `# Hi there, I'm ${data.name || username} 👋

### ${data.bio || 'Welcome to my GitHub profile!'}

- 🔭 I’m currently working on some awesome projects!
- 🌱 I’m currently learning new things every day.
- 📫 How to reach me: ${data.email || 'Check my repos'}
- ⚡ Fun fact: I have ${data.public_repos} public repos and ${data.followers} followers!

Check out my work below!`;

    // Generate Premium Template
    const premiumTemplate = `<!-- PREMIUM TEMPLATE -->
<div align="center">
  
<img src="${data.avatar_url}" width="120px" style="border-radius: 50%;" alt="Avatar"/>

# ${data.name || username}

<h3>${data.bio || 'Full-Stack Developer & Open Source Enthusiast'}</h3>

</div>

---

<div align="center">
  
![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=radical)
![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=radical)

</div>

### 🚀 About Me

- 🏢 I'm currently working at **${data.company || 'Stealth Mode'}**
- 📍 Based in **${data.location || 'Earth'}**
- 🌐 Visit my [Website/Blog](${data.blog || 'https://github.com/' + username})
- 📫 Connect with me: [${data.email || 'N/A'}]

### 🛠️ Let's Connect

<div align="center">
  <a href="https://github.com/${username}">
    <img src="https://img.shields.io/badge/GitHub-${username}-blue?style=for-the-badge&logo=github" alt="GitHub"/>
  </a>
  <a href="https://twitter.com/${data.twitter_username || username}">
    <img src="https://img.shields.io/badge/Twitter-Follow-red?style=for-the-badge&logo=twitter" alt="Twitter"/>
  </a>
</div>

---

⭐️ From [${username}](${data.html_url})`;

    res.status(200).json({ freeTemplate, premiumTemplate });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate README.' });
  }
}
