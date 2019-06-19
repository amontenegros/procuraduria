import Enumerable from 'linq';

export function CheckInArray(array, condition) {
    return Enumerable.from(array)
        .where(condition)
        .any();
}