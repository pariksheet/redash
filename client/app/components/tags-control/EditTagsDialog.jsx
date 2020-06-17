import { map, trim, uniq, compact } from "lodash";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Select from "antd/lib/select";
import Modal from "antd/lib/modal";
import { wrap as wrapDialog, DialogPropType } from "@/components/DialogWrapper";

function EditTagsDialog({ dialog, tags, getAvailableTags }) {
  const [availableTags, setAvailableTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [values, setValues] = useState(() => uniq(map(tags, trim))); // lazy evaluate

  useEffect(() => {
    let isCancelled = false;
    getAvailableTags().then(availableTags => {
      if (!isCancelled) {
        setAvailableTags(uniq(compact(map(availableTags, trim))));
        setIsLoading(false);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, [getAvailableTags]);

  return (
    <Modal
      {...dialog.props}
      onOk={() => dialog.close(values)}
      title="Add/Edit Tags"
      className="shortModal"
      wrapProps={{ "data-test": "EditTagsDialog" }}>
      <Select
        mode="tags"
        className="w-100"
        placeholder="Add some tags..."
        defaultValue={values}
        onChange={v => setValues(compact(map(v, trim)))}
        autoFocus
        disabled={isLoading}
        loading={isLoading}>
        {map(availableTags, tag => (
          <Select.Option key={tag}>{tag}</Select.Option>
        ))}
      </Select>
    </Modal>
  );
}

EditTagsDialog.propTypes = {
  dialog: DialogPropType.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
  getAvailableTags: PropTypes.func.isRequired,
};

EditTagsDialog.defaultProps = {
  tags: [],
};

export default wrapDialog(EditTagsDialog);
