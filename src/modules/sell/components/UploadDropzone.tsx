import { withForm } from "../../../hooks/form/hooks";
import { sellUploadSchema } from "../../../schemas/sellSchema";
import { sellFormOptions } from "../../../utils/formOptions";

const MAX_FILES = 10;
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const UploadDropzone = withForm({
  ...sellFormOptions,
  props: {},
  render: function Render({ form }) {
    return (
      <div className='dropzone__wrapper'>
        <form.AppField
          name='upload.images'
          validators={{ onChange: sellUploadSchema.shape.upload.shape.images }}>
          {(field) => (
            <field.Dropzone
              accept={{ "image/*": [".png", ".jpg", ".jpeg"] }}
              multiple
              maxFiles={MAX_FILES}
              maxSize={MAX_SIZE}
            />
          )}
        </form.AppField>
      </div>
    );
  },
});

export default UploadDropzone;
