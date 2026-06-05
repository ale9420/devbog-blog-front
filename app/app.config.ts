export default defineAppConfig({
  site: {
    name: "BogDev",
    description: "Personal blog about AI, Software, Linux and more",
    url: "https://bogdev.com.co",
    author: {
      name: "Anonymous",
      url: "https://bogdev.com.co/about",
    },
    social: {
      github: "https://github.com/ale9420",
      linkedin:
        "https://www.linkedin.com/in/alejandro-ramirez-garcia-046713139",
      codeberg: "https://codeberg.org/alejo9420",
      mastodon: "https://mastodon.social/@alejo9420",
    },
    comments: {
      provider: "strapi",
    },
    support: {
      buyMeACoffee: "your-username",
    },
  },
});
