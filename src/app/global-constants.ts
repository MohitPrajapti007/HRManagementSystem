
export const ERROR = "Error";
export const SUCCESS = "Success";
export const ALERT = "Alert";
export const MESSAGE = "Message";
export const ENABLE_PAGINATION = true;
export const PAGE_SIZE = 10;
export const PAGE_SIZES = [10, 30, 50];
export const NO_ID = 'no-id';
export const NULL_VALUE = null;
export const EMPTY_STRING = '';
export var ENABLE_SUBMISSION = false;
export var GLOBAL_VAR = {};
export const CONTACT_NO_REGEX = /^$|^((?!(0))[0-9]{10})$/
export const NO_REGEX = /^[0-9]+$/
export const ALPHA_REGEX = /^[a-zA-Z]+$/
export const EMAIL_REGEX = /^((?!(0))[0-9]{10})$/
export const USERNAME_REGEX = /^[a-zA-Z0-9_]{5,16}$/ 
export const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,16}$/;
export const CHECK_URL_REGEX = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
export const IS_DOMAIN_IP_ADDRESS = /^(?=.*[^\.]$)((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.?){4}$/
export const WORD_KEYS = {

}

export const URLs = {
    LOGIN: `/public/access-token`
}

export class GlobalConstants {
  
    public static fontSize: number = 0.9;
  
}