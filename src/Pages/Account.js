import React from 'react';
import { PasswordForgetForm } from '../Components/PasswordForget';
import PasswordChangeForm from '../Components/PasswordChange';

const Account = () => (
    <div>
        <h1>Account Page</h1>
        <PasswordForgetForm />
        <PasswordChangeForm />
    </div>
);

export default Account;