export const rootValue = {
  ping() { return Date.now(); },

  updateProject(args, { db, user }) {
    return db.updateProject(user, args.input);
  },
};
