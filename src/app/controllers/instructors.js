const { age, date } = require('../../lib/utils');
const Instructor = require('../models/Instructor');
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
      callback(instructors) {
        let total;
        if (!instructors[0]) {
          total = 1;
        } else {
          total = Math.ceil(instructors[0].total / limit);
        }

        const pagination = {
          total,
          page,
        };
        return res.render('instructors/index', {
          instructors,
          pagination,
          filter,
        });
      },
    };
    Instructor.paginate(params);
  },

  create(req, res) {
    return res.render('instructors/create');
  },

  post(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      //mesmo que req.body.key == ""
      if (req.body[key] == '') return res.send('Please, fill all the fields');
    }

    Instructor.create(req.body, (instructor) => {
      return res.redirect(`/instructors/${instructor.id}`);
    });
  },

  show(req, res) {
    Instructor.find(req.params.id, (instructor) => {
      if (!instructor) return res.send('Instructor not found!');
      instructor.age = age(instructor.birth);
      instructor.services = instructor.services.split(',');
      instructor.created_at = date(instructor.created_at).format;
      return res.render('instructors/show', { instructor });
    });
  },

  edit(req, res) {
    Instructor.find(req.params.id, (instructor) => {
      if (!instructor) return res.send('Instructor not found!');
      instructor.birth = date(instructor.birth).iso;
      return res.render('instructors/edit', { instructor });
    });
    return;
  },

  put(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      //mesmo que req.body.key == ""
      if (req.body[key] == '') return res.send('Please, fill all the fields');
    }

    Instructor.update(req.body, () => {
      return res.redirect(`/instructors/${req.body.id}`);
    });
  },

  delete(req, res) {
    Instructor.delete(req.body.id, () => {
      return res.redirect('/instructors');
    });
    return;
  },
};
