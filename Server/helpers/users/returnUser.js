const returnUser = (user) => {
  return {
    name: {
      first: user.name.first,
      last: user.name.last,
    },
    email: user.email,
    image: {
      url: user.image?.url || null,
      alt: user.image?.alt || null,
    },
  };
};

module.exports = returnUser;
