#
#    Bem:
#
#			bem			Make bem bundle files
#			bem.clean	Clean bem bundle files
#
#    Lint:
#
# 		   lint       	Lint all files
# 		   lint.stylus	Lint stylus files
# 		   lint.js      Lint javascript files
#
#    Build:
#
#			build			Create a build
#			build.remove	Remove a build
#

########################################################
###                     Variables                    ###
########################################################

# Scripts directory
SCRIPTS_DIR := node_modules/app-bem-dev/tools/scripts

# Bem script
SCRIPT_BEM := @ . $(SCRIPTS_DIR)/bem

# Lint script
SCRIPT_LINT := @ . $(SCRIPTS_DIR)/lint

# Build script
SCRIPT_BUILD := @ . $(SCRIPTS_DIR)/build

########################################################
###                     Bem rules                    ###
########################################################

# Make bem bundle files
.PHONY: bem
bem:
	$(SCRIPT_BEM) make

# Clean bem bundle files
.PHONY: bem.clean
bem.clean:
	$(SCRIPT_BEM) clean

########################################################
###                    Lint rules                    ###
########################################################

# Lint all files
.PHONY: lint
lint: lint.css lint.js

# Lint css files
.PHONY: lint.css
lint.css:
	$(SCRIPT_LINT) stylus bem/blocks

# Lint javascript files
.PHONY: lint.js
lint.js:
	$(SCRIPT_LINT) js

########################################################
###                    Build rules                   ###
########################################################

# Create a build
.PHONY: build
build:
	$(SCRIPT_BUILD) create

# Remove a build
.PHONY: build.remove
build.remove:
	$(SCRIPT_BUILD) remove
