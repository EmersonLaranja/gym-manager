const { age, date } = require('../../lib/utils');
const Member = require('../models/Member');

module.exports = {
  index(req, res) {
    let { filter, page, limit } = req.query;

    page = page || 1;
    limit = limit || 2;

    let offset = limit * (page - 1);

    const params = {
      filter,
      page,
      limit,
      offset,
      callback(members) {
        let total;
        if (!members[0]) {
          total = 1;
        } else {
          total = Math.ceil(members[0].total / limit);
        }

        const pagination = {
          total,
          page,
        };
        return res.render('members/index', {
          members,
          pagination,
          filter,
        });
      },
    };
    Member.paginate(params);

    // if (filter) {
    //   Instructor.findBy(filter, (instructors) => {
    //     return res.render('instructors/index', { instructors, filter });
    //   });
    // } else {
    //   Instructor.all((instructors) => {
    //     return res.render('instructors/index', { instructors });
    //   });
    // }
  },

  create(req, res) {
    Member.instructorsSelectOptions((options) => {
      return res.render('members/create', {
        instructorsOptions: options,
      });
    });
  },

  post(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      //mesmo que req.body.key == ""
      if (req.body[key] == '') return res.send('Please, fill all the fields');
    }

    Member.create(req.body, (member) => {
      return res.redirect(`/members/${member.id}`);
    });
  },

  show(req, res) {
    Member.find(req.params.id, (member) => {
      if (!member) return res.send('Member not found!');
      member.birth = date(member.birth).birthday;
      return res.render('members/show', { member });
    });
  },

  edit(req, res) {
    Member.find(req.params.id, (member) => {
      if (!member) return res.send('Member not found!');

      member.birth = date(member.birth).iso;

      Member.instructorsSelectOptions((options) => {
        return res.render('members/edit', {
          member,
          instructorsOptions: options,
        });
      });
    });
  },

  put(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      //mesmo que req.body.key == ""
      if (req.body[key] == '') return res.send('Please, fill all the fields');
    }

    Member.update(req.body, () => {
      return res.redirect(`/members/${req.body.id}`);
    });
  },

  delete(req, res) {
    Member.delete(req.body.id, () => {
      return res.redirect('/members');
    });
    return;
  },
};
