import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FieldValues, FormProvider, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { userId } from '../../../store/user/selectors';
import { ButtonSec, Form, P, SubmitButton } from './SecurityInfoTab.style';
import { PasswordForm } from './PasswordForm/PasswordForm';
import { updatePassword, updateSecurityQuestion } from '../../../api/MainPage';
import { ModalNotification } from '../reusable/ModalNotification';
import CustomSelect from '../reusable/CustomSelect/CustomSelect';
import { TextInput } from '../reusable/TextInput';
import { Fields } from '../../../constants/fields';
import { handleSchemaUserAccount } from '../../../utils/handleSchemaUserAccount';
import { selectState } from '../../../store/userAccount/selector';
import { setState } from '../../../store/userAccount/actions';
import { StateValues } from '../../../store/userAccount/constants';
import { getAccessToken } from '../../../utils/getAccessToken';

export const options: string[] = [
  '',
  'Mother`s maiden name',
  'Name of childhood best friend',
  'Favorite book',
  'Favorite color',
  'Favorite food',
  'Add your own question',
];

export const SecurityInfoTab = () => {
  const clientId = useSelector(userId);
  const [modalIs, setModal] = useState<string>('');
  const listenPasswordOrQuestion = useSelector(selectState);
  const dispatch = useDispatch();

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(handleSchemaUserAccount(listenPasswordOrQuestion)),
  });

  const {
    register,
    handleSubmit,
    formState: { isValid, errors, dirtyFields },
    reset,
    setError,
    control,
    setValue,
  } = methods;

  const watchSelectValue = useWatch({
    control,
    name: 'selectQuestion',
  });

  const onSubmit = (data: FieldValues): void => {
    const token = getAccessToken();
    if (data[Fields.Password]) {
      const requestBody = {
        oldPassword: data.passwordCurrent,
        newPassword: data.password,
        confirmNewPassword: data.passwordConfirm,
      };
      updatePassword(requestBody, clientId, token).then(({ payload, status, code }) => {
        if (status === 'success') {
          reset();
          setValue(Fields.SelectQuestion, '');
          setModal(Fields.Password);
        }
        if (code === 400)
          setError(Fields.PasswordCurrent, {
            message: `${payload}`,
          });
        if (code === 409)
          setError(Fields.PasswordConfirm, {
            message: `${payload}`,
          });
      });
    } else {
      let requestBody = {
        securityQuestion: data[Fields.SelectQuestion],
        securityAnswer: data[Fields.SecurityAnswer],
      };
      if (data[Fields.SelectQuestion] === 'Add your own question') {
        requestBody = {
          ...requestBody,
          securityQuestion: data[Fields.SecurityQuestion],
        };
      }
      updateSecurityQuestion(requestBody, clientId, token).then(({ status }) => {
        if (status === 'success') {
          reset();
          setValue(Fields.SelectQuestion, '');
          setModal('question');
        }
      });
    }
  };

  const handleClose = (): void => {
    setModal('');
  };

  const handleQuestionValidate = () => {
    dispatch(setState(StateValues.Question));
  };

  return (
    <FormProvider {...methods}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <PasswordForm />
        </div>
        <div onClick={handleQuestionValidate}>
          <P>To change sec question</P>
          <p className="block__margin">Choose one of the listed questions below</p>
          <CustomSelect
            className="securityQuestion"
            placeholder={'securityQuestion'}
            options={options}
            control={control}
            name={Fields.SelectQuestion}
            disabled={
              dirtyFields[Fields.PasswordCurrent] || dirtyFields[Fields.Password] || dirtyFields[Fields.PasswordConfirm]
            }
          />
          {watchSelectValue === 'Add your own question' && (
            <TextInput
              type={'text'}
              id={Fields.SecurityQuestion}
              label={'Type your question'}
              error={!!errors[Fields.SecurityQuestion]?.message}
              helperText={errors[Fields.SecurityQuestion]?.message}
              register={register}
              disabled={
                dirtyFields[Fields.PasswordCurrent] ||
                dirtyFields[Fields.Password] ||
                dirtyFields[Fields.PasswordConfirm]
              }
            />
          )}
          <TextInput
            type={'text'}
            id={Fields.SecurityAnswer}
            label={'Type your answer'}
            error={!!errors[Fields.SecurityAnswer]?.message}
            helperText={errors[Fields.SecurityAnswer]?.message}
            register={register}
            disabled={
              dirtyFields[Fields.PasswordCurrent] || dirtyFields[Fields.Password] || dirtyFields[Fields.PasswordConfirm]
            }
          />
        </div>
        <div>
          <SubmitButton color={'brandColor'} disabled={!isValid} size={'medium'}>
            Save
          </SubmitButton>
          <ButtonSec
            size={'medium'}
            color={'secondaryColor'}
            onClick={() => {
              reset();
              setValue(Fields.SelectQuestion, '');
            }}
          >
            Cancel
          </ButtonSec>
        </div>
        {modalIs && (
          <ModalNotification isSuccess={true} onChange={handleClose} className={'security'}>
            {modalIs === 'password' ? 'Password changed successfully' : 'Question changed successfully'}
          </ModalNotification>
        )}
      </Form>
    </FormProvider>
  );
};
