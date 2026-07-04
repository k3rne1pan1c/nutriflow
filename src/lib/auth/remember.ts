const EMAIL_KEY = 'nutriflow-remembered-email';

export function getRememberedEmail(): string {
	if (typeof localStorage === 'undefined') return '';
	return localStorage.getItem(EMAIL_KEY) ?? '';
}

export function rememberEmail(email: string) {
	if (typeof localStorage === 'undefined') return;
	localStorage.setItem(EMAIL_KEY, email.trim());
}
