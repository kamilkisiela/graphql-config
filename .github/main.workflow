workflow "CI" {
  on = "push"
  resolves = ["Test", "Build"]
}

action "Install" {
  uses = "nuxt/actions-yarn@master"
  args = "install"
}

action "Test" {
  uses = "nuxt/actions-yarn@master"
  needs = ["Install"]
  args = "test"
}

action "Build" {
  uses = "nuxt/actions-yarn@master"
  needs = ["Install"]
  args = "build"
}
