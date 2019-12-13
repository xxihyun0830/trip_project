const express = require('express');
const order = require('../models/order');
const catchErrors = require('../lib/async-error');

const router = express.Router();

function needAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('danger', '로그인을 먼저 하세요. ');
        res.redirect('/signin');
    }
}

// 상품 예약하기 화면 -> new
router.get('/new', needAuth, (req, res, next) => {
    res.render('orders/new', {order: {}});
  });
  
// 예약 수정하기
router.get('/:id/edit', needAuth, catchErrors(async (req, res, next) => {
    const order = await order.findById(req.params.id);
    res.render('orders/edit', {order: order});
}));

//예약 결과 화면 ->show.pug
router.get('/:id', catchErrors(async (req, res, next) => {
  const order = await order.findById(req.params.id).populate('user_id');
  const orders = await Order.find({order: order.id}).populate('user_id');

  await order.save();
  res.render('orders/show', {order: order, orders : orders});
}));

//예약 삭제
router.delete('/:id', needAuth, catchErrors(async (req, res, next) => {
    await order.findOneAndRemove({_id: req.params.id});
    req.flash('success', 'Successfully deleted');
    res.redirect('/orders');
}));

// 예약하기 리스트 보여 주기 
router.post('/', needAuth, catchErrors(async (req, res, next) => {
    const user = req.user;
    var order = new order({
      item: req.body.item,
      user_id: user._id,
      people : req.body.people,
      tourDate : req.body.tourDate,
      totPrice : req.body.totPrice
      
    });
    await order.save();
    req.flash('success', 'Successfully posted');
    res.redirect('/orders');
  }));

  module.exports = router;
  

