import React from 'react';
import { fireEvent, getByRole, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import IletisimFormu from './IletisimFormu';
import Goruntule from './Goruntule';

test('hata olmadan render ediliyor', () => {
    render(<IletisimFormu />)
});

test('iletişim formu headerı render ediliyor', () => {
    render(<IletisimFormu />)

    const header = screen.getByText("İletişim Formu");

    expect(header).toBeInTheDocument
    expect(header).toHaveTextContent("İletişim Formu");

});

test('kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.', async () => {
    render(<IletisimFormu />)

    const adInput = screen.getByLabelText("Ad*");
    const submitButton = screen.getByRole('button', { name: 'Gönder' });

    fireEvent.change(adInput, { target: { value: "abc" } });
    fireEvent.click(submitButton);

    const adError = screen.getByText("Hata: ad en az 5 karakter olmalıdır.")
    expect(adError).toBeInTheDocument
});

test('kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.', async () => {
    render(<IletisimFormu />)
    const submitButton = screen.getByRole("button", { name: "Gönder" });

    fireEvent.click(submitButton);

    const errorMessages = screen.getAllByTestId('error');
    expect(errorMessages).toHaveLength(3);
});

test('kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.', async () => {
    render(<IletisimFormu />)
    const adInput = screen.getByLabelText('Ad*');
    const soyadInput = screen.getByLabelText('Soyad*');
    const submitButton = screen.getByRole('button', { name: 'Gönder' });

    userEvent.type(adInput, 'İlhan');
    userEvent.type(soyadInput, 'Mansız');
    fireEvent.click(submitButton);

    const errorMessage = screen.getByTestId('error');
    expect(errorMessage).toHaveTextContent('Hata: email geçerli bir email adresi olmalıdır.');
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
    render(<IletisimFormu />)
    const mailInput = screen.getByLabelText('Email*')

    userEvent.type(mailInput, "halil@gmail");

    const errorMessage = screen.getByTestId('error');
    expect(errorMessage).toHaveTextContent("Hata: email geçerli bir email adresi olmalıdır.");
    expect(errorMessage).toBeInTheDocument();

});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
    render(<IletisimFormu />)
    const nameInput = screen.getByLabelText('Ad*');

    userEvent.type(nameInput, 'John');
    const submitButton = screen.getByRole('button', { name: 'Gönder' });

    userEvent.click(submitButton);
});

test('ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.', async () => {
    render(<IletisimFormu />)
    const adInput = screen.getByPlaceholderText('İlhan');
    const soyadInput = screen.getByPlaceholderText('Mansız');
    const emailInput = screen.getByLabelText('Email*');
    const submitButton = screen.getByRole('button', { name: 'Gönder' });

    userEvent.type(adInput, 'İlhan');
    userEvent.type(soyadInput, 'Mansız');
    userEvent.type(emailInput, 'ilhanmansiz@gmail.com');
    fireEvent.click(submitButton);

    const errorMessage = screen.queryByTestId('error');
    expect(errorMessage).toBeNull();
});

test('form gönderildiğinde girilen tüm değerler render ediliyor.', async () => {
    render(<IletisimFormu />);
    const nameInput = screen.getByLabelText('Ad*');
    const surnameInput = screen.getByLabelText('Soyad*');
    const emailInput = screen.getByLabelText('Email*');
    const messageInput = screen.getByLabelText('Mesaj');

    userEvent.type(nameInput, 'abcde');
    userEvent.type(surnameInput, 'abc');
    userEvent.type(emailInput, 'abc@example.com');
    userEvent.type(messageInput, 'Bu bir test mesajıdır');

    const submitButton = screen.getByRole('button', { name: 'Gönder' });
    userEvent.click(submitButton);
});
