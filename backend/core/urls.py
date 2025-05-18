from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from core.views import UserListView,AIAnalyzeContentView,RegisterView, ContentListCreateView, ContentDetailView, UserProfileView, LogoutView

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # login returns access and refresh tokens
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),

    path('contents/', ContentListCreateView.as_view(), name='content-list-create'),
    path('contents/<int:pk>/', ContentDetailView.as_view(), name='content-detail'),
    path('analyze-content/', AIAnalyzeContentView.as_view(), name='analyze-content'),
    path('users/me/', UserProfileView.as_view(), name='user-profile'),

    path('users-list/', UserListView.as_view(), name='user-list'),

]
