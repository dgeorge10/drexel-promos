const assert = require('assert');
const user = require('../models/User');
const post = require('../models/Post');


describe('User', function() {
    describe('#find', function() {
      it('get a user without error', function(done) {
        user.findAll({ where: {
            email: 'admin@admin.com'
        }})
        .then(done())
      });
    });
    describe('#save', function(done){
        it('create a user without error',function(done){
            done()
        })
    })
  });
  describe('Posts', function(){
    describe('#get', function(){
        it('get posts without error', function(done){
            post.findAll({})
            .then(done())
        });
    });
    describe('#add', function(){
        it('add a post without error', function(done){
            done();
        })
    })
  });