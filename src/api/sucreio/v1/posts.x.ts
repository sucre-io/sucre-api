import { Schema, ObjectPart, StringPart } from 'ts-api-validator';


export const postSchema = new Schema({
    type: ObjectPart,
    required: false,
    content: {
      created_at: {
          type: StringPart,
          required: false
      },
      updated_at: {
          type: StringPart,
          required: false
      },
      postheadline: {
          type: StringPart,
          required: true
      },
      postbody: {
          type: StringPart,
          required: true
      },
      shares: {
          type: StringPart,
          required: false
      },
      message_tags: {
          type: StringPart,
          required: true
      },
      promotion_status: {
          type: StringPart,
          required: false
      },
      privacy: {
          type: StringPart,
          required: false
      }
    }
});
