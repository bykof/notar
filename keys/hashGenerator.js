import shajs from 'sha.js';


export default function hashGenerator (
    firstName,
    lastName,
    birthdayTimestamp,
    pin
) {
    return shajs('sha256').update(
        firstName + lastName
    ).update(
        birthdayTimestamp.toString()
    ).update(
        pin.toString()
    ).digest('hex');
}