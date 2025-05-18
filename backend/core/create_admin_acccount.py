from core.models import User

admin_user = User.objects.create_user(
    username='admin',
    email='admin@45.com',
    password='adminpassword',
    role='admin'
)
admin_user.is_staff = True      
admin_user.is_superuser = True   
admin_user.save()
