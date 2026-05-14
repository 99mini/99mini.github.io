# /commit skill

커밋 전 lint:fix를 자동으로 수행하는 스킬.

## 실행 순서

1. **`pnpm lint:fix` 실행**
   - exit code가 0이 아니면 커밋을 중단하고 오류 내용을 사용자에게 보고한다.
   - lint:fix로 파일이 수정된 경우, 수정된 파일을 스테이징 목록에 포함시킨다.

2. **`git status` + `git diff --stat` 확인**
   - 스테이징할 변경 사항 파악

3. **`git add <files>`**
   - lint:fix로 수정된 파일 포함, 커밋할 파일을 명시적으로 추가
   - `git add -A` 또는 `git add .` 사용 금지

4. **`git commit -m "..."` 실행**
   - `--no-verify` 사용 금지
   - 커밋 메시지 끝에 항상 `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>` 추가
   - HEREDOC 형식으로 메시지 전달

## 주의

- lint:fix 실패 시 절대 커밋하지 않는다
- 사용자가 커밋 메시지를 지정하면 그대로 사용하고, 없으면 변경 내용을 분석해 작성한다
