const returnUser = (user) => {
  return {
    name: {
      first: user.name.first,
      last: user.name.last,
    },
    email: user.email,
    image_url: user.image?.url || null,
  };
};

module.exports = returnUser;
