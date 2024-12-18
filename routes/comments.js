import { Router } from 'express';
import { commentsData } from '../data/index.js';
import { sellersData } from '../data/index.js';
const router = Router();
import * as validation from '../utils/checks.js';

router
  .route('/:listingId')
  .get(async (req, res) => {
    try {
      req.params.listingId = validation.checkId(
        req.params.listingId,
        'listing ID'
      );
    } catch (e) {
      return res.status(400).render('error', { error: e });
    }

    try {
      let listingId = req.params.listingId;
      let comments = await commentsData.getListingComments(listingId);
      let listing = await sellersData.getListingById(listingId);

      return res.render('listing', {
        comments,
        user: req.session.user,
        listing,
        date,
      });
    } catch (e) {
      console.log(e);
      return res.status(404).render('error', { error: e });
    }
  })

  .post(async (req, res) => {
    const user = req.session.user;
    let listingId = req.params.listingId;
    try {
      if (!user) throw `Session user not found. Login again.`;
    } catch (e) {
      return res.status(401).render('customerlogin', { error: e });
    }

    let commentData = req.body;

    if (!commentData || Object.keys(commentData).length === 0) {
      return res
        .status(400)
        .json({ error: 'There are no fields in the request body' });
    }

    try {
      commentData = validation.sanitizeObject(commentData);
      let { commentText } = commentData;
      commentText = validation.checkString(commentText, 'Comment');

      let newComment = await commentsData.createComment(
        user._id,
        user.username,
        listingId,
        commentText
      );

      return res.status(200).json({ user: req.session.user });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ error: e });
    }
  })
  .delete(async (req, res) => {
    let { commentId } = req.body;
    let listingId = req.params.listingId;
    commentId = validation.sanitizeObject(commentId);
    listingId = validation.checkId(listingId, 'Listing ID');

    try {
      await commentsData.deleteComment(commentId);

      let listing = await commentsData.getListingComments(listingId);

      return res.json(listing);
    } catch (e) {
      return res.status(404).render('error', { error: e });
    }
  })
  .put(async (req, res) => {
    let { commentId, commentText } = req.body;
    commentId = validation.sanitizeObject(commentId);
    commentText = validation.sanitizeObject(commentText);

    try {
      commentId = validation.checkId(commentId, 'Comment ID');
      commentText = validation.checkString(commentText, 'Comment Text');
    } catch (e) {
      return res.status(400).render('error', { error: e });
    }

    try {
      let updatedCommentData = await commentsData.updateComment(
        commentId,
        commentText
      );

      return res.json(updatedCommentData);
    } catch (e) {
      return res.status(404).render('error', { error: e });
    }
  });

export default router;
