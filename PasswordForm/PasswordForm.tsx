import React from 'react';
import { useDispatch } from 'react-redux';
import { TextInput } from '../../reusable/TextInput';
import { useFormContext } from 'react-hook-form';
import { useToggle } from '../../../../hooks/useToggle';
import { useLockState } from '../../../../hooks/useLockState';
import { P } from '../SecurityInfoTab.style';
import { Fields } from '../../../../constants/fields';
import { StateValues } from "../../../../store/userAccount/constants";
import { setState } from "../../../../store/userAccount/actions";


export const PasswordForm = () => {
  const {register, formState: {errors, dirtyFields}, reset, setValue, resetField, getValues  } = useFormContext();
  const { state: isCurrentPasswordShown, toggle: toggleCurrentPassword } = useToggle<boolean>(false);
  const { state: isPasswordShown, toggle: togglePassword } = useToggle<boolean>(false);
  const { state: isConfirmPasswordShown, toggle: toggleConfirmPassword } = useToggle<boolean>(false);
  const [isCapsLockOn, onHandleCapsLockState, onResetLockState] = useLockState<{}>();

  const dispatch = useDispatch();

  const handleResetSecurityPart = () => {
    dispatch(setState(StateValues.Password))
  }

    return (
    <div onClick={handleResetSecurityPart}>
      <P>To change password</P>
      <p>Enter your current password, then create and confirm a new one.</p>
      <TextInput
        id={Fields.PasswordCurrent}
        type={isCurrentPasswordShown ? 'text' : 'password'}
        label={'Enter current password'}
        isPasswordShown={isCurrentPasswordShown}
        isPasswordField={true}
        onClick={toggleCurrentPassword}
        onKeyDown={(e) => onHandleCapsLockState(e, Fields.PasswordCurrent)}
        error={!!errors[Fields.PasswordCurrent]?.message || !!isCapsLockOn[Fields.PasswordCurrent]}
        helperText={isCapsLockOn[Fields.PasswordCurrent] || errors[Fields.PasswordCurrent]?.message}
        disabled={dirtyFields.securityAnswer}
        register={register}
      />
      <TextInput
        id={Fields.Password}
        type={isPasswordShown ? 'text' : 'password'}
        label={'Type new password'}
        isPasswordShown={isPasswordShown}
        isPasswordField={true}
        onClick={() => {
          togglePassword()
        }}
        onKeyDown={(e) => onHandleCapsLockState(e, Fields.Password)}
        error={!!errors[Fields.Password]?.message || !!isCapsLockOn[Fields.Password]}
        helperText={isCapsLockOn[Fields.Password] || errors[Fields.Password]?.message}
        disabled={dirtyFields.securityAnswer}
        register={register}
      />
      <TextInput
        id={Fields.PasswordConfirm}
        type={isConfirmPasswordShown ? 'text' : 'password'}
        label={'Confirm new password'}
        isPasswordShown={isConfirmPasswordShown}
        isPasswordField={true}
        onClick={toggleConfirmPassword}
        onKeyDown={(e) => onHandleCapsLockState(e, Fields.PasswordConfirm)}
        error={!!errors[Fields.PasswordConfirm]?.message || !!isCapsLockOn[Fields.PasswordConfirm]}
        helperText={isCapsLockOn[Fields.PasswordConfirm] || errors[Fields.PasswordConfirm]?.message}
        disabled={dirtyFields.securityAnswer}
        register={register}
      />
    </div>
  )
}