## 🔍 Pull Request Checklist

Please review the following before submitting your PR:

### 🔄 General
- [ ] Only intended files were modified
- [ ] No unused variables or leftover logic
- [ ] All logic changes use shared functions from `utils/game.js`

### 🧪 Testing
- [ ] All Jest tests pass (`npm test` or via GitHub Actions)
- [ ] New logic is covered by tests, if applicable
- [ ] I tested both **win** and **fail** game states

### 🎮 Game Behavior
- [ ] Clues reveal correctly, one at a time
- [ ] Correct answer is accepted
- [ ] Stats update after win/loss
- [ ] Post-game modal appears as expected
- [ ] No console errors or warnings

---

✅ Thank you for keeping the game clean and fun!
