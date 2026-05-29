from django.conf import settings
from django.core.mail import send_mail
from django.dispatch import receiver
from django_rest_passwordreset.signals import reset_password_token_created


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    """Отправка токена для восстановления пароля по почте"""

    reset_url = f"http://localhost:3000/password-reset/confirm/{reset_password_token.key}/"

    subject = "Восстановление пароля для интернет-магазина"
    
    message = f"""
    Здравствуйте, {reset_password_token.user.username}!
    
    Вы запросили восстановление пароля на нашем сайте.
    
    Для установки нового пароля перейдите по ссылке:
    {reset_url}
    
    Если вы не запрашивали восстановление пароля, просто проигнорируйте это письмо.
    
    Ссылка действительна в течение 2 часов.
    
    Примечание: это сообщение с тестового сайта, если вы получили его случайно, проигнорируйте его!
    """
    
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL, 
        recipient_list=[reset_password_token.user.email],
        fail_silently=False,  
    )
