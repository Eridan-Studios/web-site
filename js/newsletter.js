/**
 * Newsletter form handler for ConvertKit integration
 * Preserves the original ConvertKit functionality while using custom HTML structure
 */

class NewsletterForm {
    constructor() {
        this.formId = '8653748';
        this.uid = '55ed862996';
        this.apiUrl = 'https://app.kit.com/forms/8653748/subscriptions';
        this.init();
    }

    init() {
        // Load ConvertKit script if not already loaded
        this.loadConvertKitScript();
        
        // Set up form submission handler
        this.setupFormHandler();
        
        // Set up checkbox change handler
        this.setupCheckboxHandler();
    }

    loadConvertKitScript() {
        if (!document.querySelector('script[src*="convertkit.com"]')) {
            const script = document.createElement('script');
            script.src = 'https://f.convertkit.com/ckjs/ck.5.js';
            script.async = true;
            document.head.appendChild(script);
        }
    }

    setupFormHandler() {
        const form = document.querySelector('.newsletter-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit(e);
        });
        
        // Initially disable the submit button
        this.updateSubmitButtonState();
    }

    setupCheckboxHandler() {
        const checkbox = document.querySelector('.newsletter-form input[type="checkbox"]');
        if (!checkbox) return;

        checkbox.addEventListener('change', () => {
            this.updateSubmitButtonState();
        });
    }

    updateSubmitButtonState() {
        const checkbox = document.querySelector('.newsletter-form input[type="checkbox"]');
        const submitBtn = document.querySelector('.newsletter-form .subscribe-btn');
        
        if (!checkbox || !submitBtn) return;

        const isChecked = checkbox.checked;
        submitBtn.disabled = !isChecked;
        
        // Update button appearance based on state
        if (isChecked) {
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
        } else {
            submitBtn.style.opacity = '0.6';
            submitBtn.style.cursor = 'not-allowed';
        }
    }

    async handleSubmit(event) {
        const form = event.target;
        const emailInput = form.querySelector('input[type="email"]');
        const checkbox = form.querySelector('input[type="checkbox"]');
        const submitBtn = form.querySelector('.subscribe-btn');

        // Validate form
        if (!emailInput.value || !checkbox.checked) {
            this.showError('Please enter your email and agree to receive marketing emails.');
            return;
        }

        // Show loading state
        this.setLoadingState(submitBtn, true);

        try {
            // Use ConvertKit's JavaScript SDK if available, otherwise fall back to fetch
            if (window.ConvertKit) {
                await this.submitViaConvertKitSDK(emailInput.value);
            } else {
                await this.submitViaFetch(emailInput.value);
            }
            
            this.showSuccess('Success! Now check your email to confirm your subscription.');
            form.reset();
            this.updateSubmitButtonState(); // Reset button state after form reset
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            this.showError('Something went wrong. Please try again.');
        } finally {
            this.setLoadingState(submitBtn, false);
        }
    }

    async submitViaConvertKitSDK(email) {
        // Use ConvertKit's JavaScript SDK
        return new Promise((resolve, reject) => {
            window.ConvertKit.subscribe({
                email: email,
                formId: this.formId,
                uid: this.uid,
                success: () => {
                    console.log('ConvertKit SDK submission successful');
                    resolve();
                },
                error: (error) => {
                    console.error('ConvertKit SDK submission error:', error);
                    reject(error);
                }
            });
        });
    }

    async submitViaFormSubmission(email) {
        // Create a temporary form element that mimics the original ConvertKit form
        const tempForm = document.createElement('form');
        tempForm.method = 'POST';
        tempForm.action = this.apiUrl;
        tempForm.style.display = 'none';
        
        // Add the required fields
        const emailField = document.createElement('input');
        emailField.type = 'hidden';
        emailField.name = 'email_address';
        emailField.value = email;
        tempForm.appendChild(emailField);

        const formIdField = document.createElement('input');
        formIdField.type = 'hidden';
        formIdField.name = 'form_id';
        formIdField.value = this.formId;
        tempForm.appendChild(formIdField);

        const uidField = document.createElement('input');
        uidField.type = 'hidden';
        uidField.name = 'uid';
        uidField.value = this.uid;
        tempForm.appendChild(uidField);

        // Add to DOM temporarily
        document.body.appendChild(tempForm);

        try {
            // Submit the form
            tempForm.submit();
            
            // Wait a bit to see if submission was successful
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            console.log('Form submitted via form submission method');
            return true;
        } catch (error) {
            console.error('Form submission error:', error);
            return false;
        } finally {
            // Clean up
            document.body.removeChild(tempForm);
        }
    }

    async submitViaFetch(email) {
        // Alternative method using fetch API
        const formData = new FormData();
        formData.append('email_address', email);
        formData.append('form_id', this.formId);
        formData.append('uid', this.uid);

        console.log('Submitting to ConvertKit via fetch:', {
            email: email,
            formId: this.formId,
            uid: this.uid,
            apiUrl: this.apiUrl
        });

        const response = await fetch(this.apiUrl, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
            }
        });

        console.log('ConvertKit response:', response.status, response.statusText);

        if (response.ok) {
            const responseData = await response.text();
            console.log('ConvertKit response data:', responseData);
            return true;
        } else {
            const errorText = await response.text();
            console.error('ConvertKit error:', response.status, errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
    }

    setLoadingState(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.style.opacity = '1';
            button.style.cursor = 'not-allowed';
            button.innerHTML = '<div class="formkit-spinner"><div></div><div></div><div></div></div><span>Subscribing...</span>';
        } else {
            button.innerHTML = 'Subscribe to Newsletter';
            // Restore the button state based on checkbox
            this.updateSubmitButtonState();
        }
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingAlert = document.querySelector('.newsletter-alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        // Create new message
        const alert = document.createElement('div');
        alert.className = `newsletter-alert newsletter-alert-${type}`;
        alert.textContent = message;

        // Insert after the form
        const form = document.querySelector('.newsletter-form');
        form.parentNode.insertBefore(alert, form.nextSibling);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const newsletterForm = new NewsletterForm();
    
    // Add a test method to window for debugging
    window.testNewsletterForm = () => {
        console.log('Testing newsletter form...');
        console.log('Form ID:', newsletterForm.formId);
        console.log('UID:', newsletterForm.uid);
        console.log('API URL:', newsletterForm.apiUrl);
        console.log('ConvertKit SDK available:', !!window.ConvertKit);
        
        // Test with a dummy email
        const testEmail = 'test@example.com';
        console.log('Testing submission with email:', testEmail);
        
        newsletterForm.submitViaFetch(testEmail)
            .then(() => console.log('Test submission successful'))
            .catch(error => console.error('Test submission failed:', error));
    };
});
