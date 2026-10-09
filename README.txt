Yusiuuu GitHub CMS 버전

이 버전은 Netlify Identity/Git Gateway 없이 GitHub OAuth 방식으로 Decap CMS를 사용합니다.

1) GitHub 저장소 확인
- admin/config.yml의 repo 값이 실제 저장소와 같아야 합니다.
- 기본값: baejy0117/Yusiuuu
- GitHub 주소가 https://github.com/다른이름/Yusiuuu 라면 repo를 다른이름/Yusiuuu 로 바꾸세요.

2) GitHub에 업로드
- 이 폴더 안의 파일들을 저장소 루트에 업로드하세요.
- index.html이 저장소 첫 화면에 바로 보여야 합니다.

3) Netlify 배포 설정
- Build command: npm run build
- Publish directory: .
- netlify.toml이 있으므로 보통 자동 반영됩니다.

4) GitHub OAuth App 만들기
- GitHub > Settings > Developer settings > OAuth Apps > New OAuth App
- Authorization callback URL: https://api.netlify.com/auth/done

5) Netlify OAuth provider 설치
- Netlify > Project configuration > Security > OAuth
- Install provider > GitHub
- GitHub OAuth App의 Client ID와 Client Secret 입력

6) 관리자 접속
- https://내사이트주소.netlify.app/admin
- GitHub 계정으로 로그인 후 글 작성/사진 업로드
