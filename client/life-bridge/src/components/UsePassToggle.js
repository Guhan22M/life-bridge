import React, { useState } from 'react';
import {FaEye, FaEyeSlash} from "react-icons/fa";

const usePassToggle = () => {
    const [visible, setVisible] = useState(false);

    const Icon = visible ? (
        <FaEye onClick={() => setVisible(false)} style={{ cursor: 'pointer' }} />
      ) : (
        <FaEyeSlash onClick={() => setVisible(true)} style={{ cursor: 'pointer' }} />
      );

    const InputType = visible ? "text":"password";

    return [InputType, Icon];
}

export default usePassToggle