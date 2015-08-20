class system {
	file { '/etc/motd':
		content => 'Hapinessometer Service development VM'
	}

	exec { 'apt update':
		command => 'apt-get update',
		path => '/usr/bin'
	}

	package { 'vim':
		ensure => installed,
		require => Exec['apt update']
	}

	package { 'git':
		ensure => installed,
		require => Exec['apt update']
	}
}