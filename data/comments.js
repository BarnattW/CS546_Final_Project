import { ObjectId } from 'mongodb';
import { listings, customers } from '../config/mongoCollections.js';
import * as validation from '../utils/checks.js';
import * as sellerDataFunctions from './seller.js';
import { customersDataFunctions } from './customers.js';

// Just a test

const createComment = async (
  commenterId,
  commenterName,
  listingId,
  comment
) => {
  commenterId = validation.checkId(commenterId, 'commenterId');
  commenterName = validation.checkString(commenterName, 'commenterName');
  listingId = validation.checkId(listingId, 'listingId');
  comment = validation.checkString(comment, 'comment');

  const commenter = await customersDataFunctions.getCustomerById(commenterId);
  if (!commenter) throw 'Commenter does not exist.';

  if (commenter.comments.length > 0) {
    for (let i = 0; i < commenter.comments.length; i++) {
      if (commenter.comments[i].listingId === listingId)
        throw 'Customer already made a review for this listing.';
    }
  }

  const listing = await sellerDataFunctions.getListingById(listingId);
  if (!listing) throw 'Listing does not exist.';

  const date = new Date();
  const timeString = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  let newComment = {
    _id: new ObjectId(),
    commenterId,
    commenterName,
    listingId,
    comment,
    timeString,
  };

  const listingCollection = await listings();
  const updateInfoListing = await listingCollection.updateOne(
    { _id: new ObjectId(listingId) },
    {
      $push: {
        comments: newComment,
      },
    }
  );

  if (!updateInfoListing.matchedCount && !updateInfoListing.modifiedCount)
    throw 'Could not create comment';

  const customerCollection = await customers();
  const updateInfoCustomer = await customerCollection.updateOne(
    { _id: new ObjectId(commenterId) },
    {
      $push: {
        comments: newComment,
      },
    }
  );

  if (!updateInfoCustomer.matchedCount && !updateInfoCustomer.modifiedCount)
    throw 'Could not create comment';

  return newComment;
};

const getCustomerComments = async (customerId) => {
  customerId = validation.checkId(customerId, 'customerId');
  const customerCollection = await customers();

  const customer = await customerCollection.findOne({
    _id: new ObjectId(customerId),
  });

  if (!customer) throw 'Could not find customer with that id';

  return customer.comments;
};

const getCommentById = async (commentId) => {
  commentId = validation.checkId(commentId, 'commentId');
  const listingCollection = await listings();

  const listing = await listingCollection.findOne({
    'comments._id': new ObjectId(commentId),
  });

  if (!listing) throw 'Could not find comment with that id';

  const comment = listing.comments.find(
    (comment) => comment?._id?.toString() === commentId
  );

  return comment;
};

const getListingComments = async (listingId) => {
  listingId = validation.checkId(listingId, 'listingId');
  const listingCollection = await listings();

  const listing = await listingCollection.findOne({
    _id: new ObjectId(listingId),
  });

  if (!listing) throw 'Could not find listing with that id';

  return listing.comments;
};

// below is potentially optional
const updateComment = async (commentId, updatedComment) => {
  commentId = validation.checkId(commentId, 'commentId');
  updatedComment = validation.checkString(updatedComment, 'updatedComment');

  const listingCollection = await listings();
  const updateInfo = await listingCollection.updateOne(
    { 'comments._id': new ObjectId(commentId) },
    {
      $set: {
        'comments.$.comment': updatedComment,
        'comments.$.timeString': new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short',
        }),
      },
    }
  );

  if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    throw 'Could not update comment';

  return await getCommentById(commentId);
};

const deleteComment = async (commentId) => {
  commentId = validation.checkId(commentId, 'commentId');

  const listingCollection = await listings();
  const updateInfo = await listingCollection.updateOne(
    { 'comments._id': new ObjectId(commentId) },
    {
      $pull: {
        comments: { _id: new ObjectId(commentId) },
      },
    }
  );

  // delete from user object as well
  const customerCollection = await customers();
  const updateInfoCustomer = await customerCollection.updateOne(
    { 'comments._id': new ObjectId(commentId) },
    {
      $pull: {
        comments: { _id: new ObjectId(commentId) },
      },
    }
  );

  if (!updateInfoCustomer.matchedCount && !updateInfoCustomer.modifiedCount)
    throw 'Could not delete comment';

  if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    throw 'Could not delete comment';

  return true;
};

export const commentsDataFunctions = {
  getCustomerComments,
  getListingComments,
  createComment,
  updateComment,
  deleteComment,
};
